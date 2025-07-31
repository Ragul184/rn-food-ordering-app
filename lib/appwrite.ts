import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const appwriteConfig = {
    // Adding ! at the end of the environment variables to ensure they are not undefined
    // This is a non-null assertion operator in TypeScript, which tells the compiler that the value will not be null or undefined.
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!, // Your Appwrite endpoint
    platform: "com.rn.foodorder",
    project: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!, // Your Appwrite project
    databaseId: "6886cafd00062f837dde",
    userCollectionId: "6886cb29000ff7522387",
}

export const client = new Client();
// Setting the endpoint, project, and platform for the Appwrite client
client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.project)
    .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const database = new Databases(client);
// User Avatars
export const avatars = new Avatars(client);

export const createUser = async ({ name, email, password }: CreateUserParams) => {
    try {
        // Create a new user in the Appwrite database
        const newAccount = await account.create(
            ID.unique(), // Unique ID for the user
            email,
            password,
            name
        );

        if (!newAccount) {
            throw Error;
        }

        await signIn({ email, password });

        const avatarUrl = await avatars.getInitialsURL(name);

        // Creating a new user document in the database
        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                email,
                name,
                accountId: newAccount.$id,
                avatar: avatarUrl
            })

        return newUser;
    } catch (e) {
        console.error("Error creating user:", e);
        throw new Error(e as string || "Failed to create user");
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        // Sign in the user with email and password
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (e) {
        console.error("Error signing in:", e);
        throw new Error(e as string || "Failed to sign in");
    }
}

export const getCurrentUser = async () => {
    try {
        // Get the current user session
        const currentAccount = await account.get();
        
        if (!currentAccount) throw Error;
        
        // Fetch the user document from the database
        const currentUser = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            // Filtering the user document by accountId using Query.equal
            [Query.equal("accountId", currentAccount.$id)],
        );
        
        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (e) {
        console.error("Error getting current user:", e);
        throw new Error(e as string || "Failed to get current user");
    }
}

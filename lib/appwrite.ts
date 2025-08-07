import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
    // Adding ! at the end of the environment variables to ensure they are not undefined
    // This is a non-null assertion operator in TypeScript, which tells the compiler that the value will not be null or undefined.
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!, // Your Appwrite endpoint
    platform: "com.rn.foodorder",
    project: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!, // Your Appwrite project
    databaseId: "6886cafd00062f837dde",
    bucketId: "688c38040010b4ecec98",
    userCollectionId: "6886cb29000ff7522387",
    categoriesCollectionId: "688c1e6b000115cad037",
    menuCollectionId: "688c1f9f0036d93e3bf0",
    customizationsCollectionId: "688c20f8002c96db7631",
    menuCustomizationsCollectionId: "688c35a00029edecb53e",
}

export const client = new Client();
// Setting the endpoint, project, and platform for the Appwrite client
client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.project)
    .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
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
        const newUser = await databases.createDocument(
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
        const currentUser = await databases.listDocuments(
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

export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
        // If category is 'all' or empty string, ignore category filter
        const actualCategory = !category || category === 'all' ? undefined : category;
        const queries: string[] = [];

        // If category is provided, add a query to filter by category
        if (actualCategory) queries.push(Query.equal("categories", actualCategory));
        // If query is provided, add a query to search by name
        if (query) queries.push(Query.search("name", query));

        // Fetch the menu items from the database with the specified queries
        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries
        );
        return menus.documents;
    } catch (error) {
        console.error("Error fetching menu:", error);
        throw new Error(error as string || "Failed to fetch menu");
    }
}

export const getCategories = async () => {
    try {
        // Fetch the categories from the database
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId
        );
        return categories.documents;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error(error as string || "Failed to fetch categories");
    }
}

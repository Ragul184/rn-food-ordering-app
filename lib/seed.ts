import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;
console.log("Loaded dummyData:", data);

async function clearAll(collectionId: string): Promise<void> {
    console.log(`Clearing collection: ${collectionId}`);
    const list = await databases.listDocuments(
        appwriteConfig.databaseId,
        collectionId
    );
    console.log(`Found ${list.documents.length} documents in ${collectionId}`);

    await Promise.all(
        list.documents.map((doc) => {
            console.log(`Deleting document ${doc.$id} from ${collectionId}`);
            return databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id);
        })
    );
    console.log(`Cleared collection: ${collectionId}`);
}

async function clearStorage(): Promise<void> {
    console.log("Clearing storage bucket:", appwriteConfig.bucketId);
    const list = await storage.listFiles(appwriteConfig.bucketId);
    console.log(`Found ${list.files.length} files in storage`);

    await Promise.all(
        list.files.map((file) => {
            console.log(`Deleting file ${file.$id} from storage`);
            return storage.deleteFile(appwriteConfig.bucketId, file.$id);
        })
    );
    console.log("Cleared storage bucket");
}

async function uploadImageToStorage(imageUrl: string) {
    console.log(`Uploading image: ${imageUrl}`);
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    console.log(`Fetched image blob:`, { type: blob.type, size: blob.size });

    const fileObj = {
        name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
        type: "image/png",
        size: blob.size,
        uri: imageUrl,
    };
    console.log("File object for upload:", fileObj);

    const file = await storage.createFile(
        appwriteConfig.bucketId,
        ID.unique(),
        fileObj
    );
    console.log(`Uploaded file: ${file.$id}`);

    const fileUrl = storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
    console.log(`File view URL: ${fileUrl}`);
    return fileUrl;
}

async function seed(): Promise<void> {
    console.log("Starting seed process...");

    // 1. Clear all
    await clearAll(appwriteConfig.categoriesCollectionId);
    await clearAll(appwriteConfig.customizationsCollectionId);
    await clearAll(appwriteConfig.menuCollectionId);
    await clearAll(appwriteConfig.menuCustomizationsCollectionId);
    await clearStorage();

    // 2. Create Categories
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
        console.log("Creating category:", cat);
        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId,
            ID.unique(),
            cat
        );
        console.log(`Created category document: ${doc.$id}`);
        categoryMap[cat.name] = doc.$id;
    }
    console.log("Category map:", categoryMap);

    // 3. Create Customizations
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
        console.log("Creating customization:", cus);
        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.customizationsCollectionId,
            ID.unique(),
            {
                name: cus.name,
                price: cus.price,
                type: cus.type,
            }
        );
        console.log(`Created customization document: ${doc.$id}`);
        customizationMap[cus.name] = doc.$id;
    }
    console.log("Customization map:", customizationMap);

    // 4. Create Menu Items
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
        console.log("Processing menu item:", item.name);
        const uploadedImage = await uploadImageToStorage(item.image_url);
        console.log(`Uploaded image for ${item.name}: ${uploadedImage}`);

        const doc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            ID.unique(),
            {
                name: item.name,
                description: item.description,
                image_url: uploadedImage,
                price: item.price,
                rating: item.rating,
                calories: item.calories,
                protein: item.protein,
                categories: categoryMap[item.category_name],
            }
        );
        console.log(`Created menu document: ${doc.$id}`);
        menuMap[item.name] = doc.$id;

        // 5. Create menu_customizations
        for (const cusName of item.customizations) {
            console.log(`Linking customization ${cusName} to menu ${item.name}`);
            await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.menuCustomizationsCollectionId,
                ID.unique(),
                {
                    menu: doc.$id,
                    customizations: customizationMap[cusName],
                }
            );
            console.log(`Linked customization ${cusName} to menu ${item.name}`);
        }
    }
    console.log("Menu map:", menuMap);

    console.log("✅ Seeding complete.");
}

export default seed;
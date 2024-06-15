import {
   Account,
   Avatars,
   Client,
   Databases,
   ID,
   Query,
} from 'react-native-appwrite';

export const config = {
   endpoint: 'https://cloud.appwrite.io/v1',
   platform: 'com.lam.aoratry',
   projectId: '6657211a00278b543361',
   databaseId: '66572335001a614616e4',
   userCollectionId: '66572354001860b7a9a5',
   videoCollectionId: '6657237900312e92ee96',
   storageId: '66574320002174cce55a',
};

const {
   endpoint,
   platform,
   projectId,
   databaseId,
   userCollectionId,
   videoCollectionId,
   storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
   .setEndpoint(config.endpoint) // Your Appwrite Endpoint
   .setProject(config.projectId) // Your project ID
   .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
   try {
      const newAccount = await account.create(
         ID.unique(),
         email,
         password,
         username
      );
      if (!newAccount) throw Error;

      const avartarUrl = avatars.getInitials(username);

      await signIn(email, password);

      const newUser = await databases.createDocument(
         config.databaseId,
         config.userCollectionId,
         ID.unique(),
         {
            accountId: newAccount.$id,
            email,
            username,
            avatar: avartarUrl,
         }
      );
      //asd
      return newUser;
   } catch (error) {
      console.log(error);
      throw new Error(error);
   }
};

export const signIn = async (email, password) => {
   try {
      const session = await account.createEmailPasswordSession(email, password);

      return session;
   } catch (error) {
      throw new Error(error);
   }
};

export const getCurrentUser = async () => {
   try {
      const currentAccount = await account.get();

      if (!currentAccount) throw Error;

      const currentUser = await databases.listDocuments(
         config.databaseId,
         config.userCollectionId,
         [Query.equal('accountId', currentAccount.$id)]
      );

      if (!currentUser) throw Error;

      return currentUser.documents[0];
   } catch (error) {
      console.log(error);
   }
};

export const getAllPosts = async () => {
   try {
      const posts = await databases.listDocuments(
         databaseId,
         videoCollectionId
      );

      return posts.documents;
   } catch (error) {
      throw new Error(error);
   }
};

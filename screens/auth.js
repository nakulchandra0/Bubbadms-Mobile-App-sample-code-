import { AsyncStorage } from "react-native";

export const USER_KEY = "@Bubbadms:userid";
export const USERDATA_KEY = "@Bubbadms:userData";
export const INFOSCREEN_KEY = "@Bubbadms:infoscreen";

export const onSignIn = async () => {
  await AsyncStorage.setItem(USER_KEY, "true")
  await AsyncStorage.setItem(INFOSCREEN_KEY, "true")
};

// export const onSignIn = () => AsyncStorage.setItem("infoscreen", "true");

export const onSignOut = () => {
  AsyncStorage.removeItem(USER_KEY)
  AsyncStorage.removeItem(USERDATA_KEY)
  // AsyncStorage.clear()
};

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_KEY)
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};

export const isFirsttimelogin = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(INFOSCREEN_KEY)
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};


// async storeToken(user) {
//   try {
//      await AsyncStorage.setItem(USERDATA_KEY, JSON.stringify(user));
//   } catch (error) {
//     console.log("Something went wrong", error);
//   }
// }
export const getUserData = () => {
  // try {
  //   let userData = AsyncStorage.getItem(USERDATA_KEY);
  //   let data = JSON.parse(userData);
  //   console.log(data);
  // } catch (error) {
  //   console.log("Something went wrong", error);
  // }
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USERDATA_KEY)
      .then(res => {
        if (res !== null) {
          resolve(res);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};

export const storeUserData =(user) => {
  try {
      AsyncStorage.setItem(USERDATA_KEY, JSON.stringify(user));
  } catch (error) {
      console.log("Something went wrong", error);
  }
}
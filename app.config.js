export default {
  "expo": {
    "name": "MedEase",
    "slug": "MedEase",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/melogo.png",
    "scheme": "medease",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/melogo.png"
    },
    "plugins": [
      "expo-notifications",
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/melogo.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "b9611c77-4c62-4552-b532-65cc1b5a8dc8"
      },
      "agentUrl": process.env.AGENT_URL,
    },
    "owner": "expoclown"
  }
}

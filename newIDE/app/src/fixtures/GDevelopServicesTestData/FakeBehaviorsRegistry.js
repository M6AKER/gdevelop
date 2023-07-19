// @flow
import { type BehaviorsRegistry } from '../../Utils/GDevelopServices/Extension';
import { type BehaviorShortHeader } from '../../Utils/GDevelopServices/Extension';

export const fakeBehaviorsRegistry: BehaviorsRegistry & {
  // The service gives CSV but it's converted on the fly to an array.
  headers: Array<BehaviorShortHeader & { tags: any }>,
} = {
  "views": {
    "default": {
      "firstIds": [
        {
          "extensionName": "Health",
          "behaviorName": "Health"
        },
        {
          "extensionName": "FireBullet",
          "behaviorName": "FireBullet"
        }
      ]
    }
  },
  "headers": [
    {
      "tier": "reviewed",
      "authorIds": [
        "IWykYNRvhCZBN3vEgKEbBPOR3Oc2"
      ],
      "extensionNamespace": "",
      "fullName": "Billboard",
      "name": "Billboard",
      "version": "1.0.0",
      "url": "https://resources.gdevelop-app.com/extensions/Billboard.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/Billboard-header.json",
      "tags": "3d",
      "category": "Visual effect",
      "previewIconUrl": "https://asset-resources.gdevelop.io/public-resources/Icons/b46f9cf1fc6b0ef59a461c7831003d1fb091137cbedbae876774f40f8b7dea97_pine-tree.svg",
      "extensionName": "Billboard",
      "description": "Rotate to always face the camera (only the front face of the cube should be enabled).",
      "objectType": "Scene3D::Cube3DObject"
    },
    {
      "tier": "reviewed",
      "authorIds": [
        "wWP8BSlAW0UP4NeaHa2LcmmDzmH2"
      ],
      "extensionNamespace": "",
      "fullName": "Bounce",
      "name": "Bounce",
      "version": "0.2.1",
      "url": "https://resources.gdevelop-app.com/extensions/Bounce.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/Bounce-header.json",
      "tags": "bounce,bullet,ricochet",
      "category": "Movement",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/volleyball.svg",
      "extensionName": "Bounce",
      "description": "Provides an action to make the object bounce from another object it just touched. Add a permanent force to the object and, when in collision with another one, use the action to make it bounce realistically.",
      "objectType": ""
    },
    {
      "tier": "reviewed",
      "authorIds": [
        "wWP8BSlAW0UP4NeaHa2LcmmDzmH2",
        "xpwUwByyImTDcHEqDUqfyg0oRBt1",
        "2OwwM8ToR9dx9RJ2sAKTcrLmCB92",
        "gqDaZjCfevOOxBYkK6zlhtZnXCg1"
      ],
      "extensionNamespace": "",
      "fullName": "Fire bullets",
      "name": "FireBullet",
      "version": "0.6.3",
      "url": "https://resources.gdevelop-app.com/extensions/FireBullet.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/FireBullet-header.json",
      "tags": "fire,bullet,spawn,firerate,reload,weapon,ranged,ammo,overheat",
      "category": "Game mechanic",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/bullet.svg",
      "extensionName": "FireBullet",
      "description": "Fire bullets, manage ammo, reloading, and overheating.",
      "objectType": ""
    },
    {
      "tier": "reviewed",
      "authorIds": [
        "wWP8BSlAW0UP4NeaHa2LcmmDzmH2"
      ],
      "extensionNamespace": "",
      "fullName": "Flash (blink)",
      "name": "Flash",
      "version": "1.0.1",
      "url": "https://resources.gdevelop-app.com/extensions/Flash.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/Flash-header.json",
      "tags": "flash,blink,visible,invisible,hit,damage",
      "category": "Visual effect",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/flash-outline.svg",
      "extensionName": "Flash",
      "description": "Make the object flash (blink) for a period of time, so that it is alternately visible and invisible.\nTrigger the effect by using the Flash action.",
      "objectType": ""
    },
    {
      "tier": "reviewed",
      "authorIds": [
        "2OwwM8ToR9dx9RJ2sAKTcrLmCB92",
        "taRwmWxwAFYFL9yyBwB3cwBw0BO2",
        "mnImQKdn8nQxwzkS5D6a1JB27V23"
      ],
      "extensionNamespace": "",
      "fullName": "Platformer gamepad mapper",
      "name": "PlatformerGamepadMapper",
      "version": "0.6.1",
      "url": "https://resources.gdevelop-app.com/extensions/Gamepads.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/Gamepads-header.json",
      "tags": "controllers,gamepads,joysticks,axis,xbox,ps4",
      "category": "Input",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/gamepad-variant-outline.svg",
      "extensionName": "Gamepads",
      "description": "Control a platformer character with a gamepad.",
      "objectType": ""
    },
    {
      "tier": "reviewed",
      "authorIds": [
        "2OwwM8ToR9dx9RJ2sAKTcrLmCB92",
        "taRwmWxwAFYFL9yyBwB3cwBw0BO2",
        "mnImQKdn8nQxwzkS5D6a1JB27V23"
      ],
      "extensionNamespace": "",
      "fullName": "Top-down gamepad mapper",
      "name": "TopDownGamepadMapper",
      "version": "0.6.1",
      "url": "https://resources.gdevelop-app.com/extensions/Gamepads.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/Gamepads-header.json",
      "tags": "controllers,gamepads,joysticks,axis,xbox,ps4",
      "category": "Input",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/gamepad-variant-outline.svg",
      "extensionName": "Gamepads",
      "description": "Control a top-down character with a gamepad.",
      "objectType": ""
    },
    {
      "tier": "reviewed",
      "authorIds": [
        "wWP8BSlAW0UP4NeaHa2LcmmDzmH2",
        "xpwUwByyImTDcHEqDUqfyg0oRBt1",
        "gqDaZjCfevOOxBYkK6zlhtZnXCg1"
      ],
      "extensionNamespace": "",
      "fullName": "Health",
      "name": "Health",
      "version": "0.3.0",
      "url": "https://resources.gdevelop-app.com/extensions/Health.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/Health-header.json",
      "tags": "health,life,damage,hit,heal,shield,regeneration,armor",
      "category": "Game mechanic",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/heart-half-full.svg",
      "extensionName": "Health",
      "description": "Manage health (life) points including a protective shield and armor.",
      "objectType": ""
    },
    {
      "tier": "reviewed",
      "authorIds": [
        "IWykYNRvhCZBN3vEgKEbBPOR3Oc2"
      ],
      "extensionNamespace": "",
      "fullName": "Smooth Camera",
      "name": "SmoothCamera",
      "version": "0.3.0",
      "url": "https://resources.gdevelop-app.com/extensions/SmoothCamera.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/SmoothCamera-header.json",
      "tags": "camera,scrolling,follow,smooth",
      "category": "Camera",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/Line Hero Pack/Master/SVG/Computers and Hardware/Computers and Hardware_camcoder_gopro_go_pro_camera.svg",
      "extensionName": "SmoothCamera",
      "description": "Smoothly scroll to follow an object.",
      "objectType": ""
    },
    {
      "tier": "reviewed",
      "authorIds": [
        "IWykYNRvhCZBN3vEgKEbBPOR3Oc2"
      ],
      "extensionNamespace": "",
      "fullName": "Smooth platformer camera",
      "name": "SmoothPlatformerCamera",
      "version": "0.3.0",
      "url": "https://resources.gdevelop-app.com/extensions/SmoothCamera.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/SmoothCamera-header.json",
      "tags": "camera,scrolling,follow,smooth",
      "category": "Camera",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/Line Hero Pack/Master/SVG/Computers and Hardware/Computers and Hardware_camcoder_gopro_go_pro_camera.svg",
      "extensionName": "SmoothCamera",
      "description": "Smoothly scroll to follow a character and stabilize the camera when jumping.",
      "objectType": ""
    },
    {
      "tier": "reviewed",
      "authorIds": [
        "gqDaZjCfevOOxBYkK6zlhtZnXCg1",
        "1OgYzWp5UeVPbiWGJwI6vqfgZLC3",
        "v0YRpdAnIucZFgiRCCecqVnGKno2",
        "IWykYNRvhCZBN3vEgKEbBPOR3Oc2"
      ],
      "extensionNamespace": "",
      "fullName": "Platformer multitouch controller mapper",
      "name": "PlatformerMultitouchMapper",
      "version": "1.2.2",
      "url": "https://resources.gdevelop-app.com/extensions/SpriteMultitouchJoystick.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/SpriteMultitouchJoystick-header.json",
      "tags": "multitouch,joystick,thumbstick,controller,touchscreen,twin stick,shooter,virtual",
      "category": "Input",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/Line Hero Pack/Master/SVG/Videogames/Videogames_controller_joystick_arrows_direction.svg",
      "extensionName": "SpriteMultitouchJoystick",
      "description": "Control a platformer character with a multitouch controller.",
      "objectType": ""
    },
    {
      "tier": "reviewed",
      "authorIds": [
        "gqDaZjCfevOOxBYkK6zlhtZnXCg1",
        "1OgYzWp5UeVPbiWGJwI6vqfgZLC3",
        "v0YRpdAnIucZFgiRCCecqVnGKno2",
        "IWykYNRvhCZBN3vEgKEbBPOR3Oc2"
      ],
      "extensionNamespace": "",
      "fullName": "Top-down multitouch controller mapper",
      "name": "TopDownMultitouchMapper",
      "version": "1.2.2",
      "url": "https://resources.gdevelop-app.com/extensions/SpriteMultitouchJoystick.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/SpriteMultitouchJoystick-header.json",
      "tags": "multitouch,joystick,thumbstick,controller,touchscreen,twin stick,shooter,virtual",
      "category": "Input",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/Line Hero Pack/Master/SVG/Videogames/Videogames_controller_joystick_arrows_direction.svg",
      "extensionName": "SpriteMultitouchJoystick",
      "description": "Control a top-down character with a multitouch controller.",
      "objectType": ""
    },
    {
      "tier": "reviewed",
      "authorIds": [
        "wWP8BSlAW0UP4NeaHa2LcmmDzmH2",
        "2OwwM8ToR9dx9RJ2sAKTcrLmCB92",
        "IWykYNRvhCZBN3vEgKEbBPOR3Oc2"
      ],
      "extensionNamespace": "",
      "fullName": "Stay on Screen",
      "name": "StayOnScreen",
      "version": "1.0.1",
      "url": "https://resources.gdevelop-app.com/extensions/StayOnScreen.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/StayOnScreen-header.json",
      "tags": "positioning,camera,screen",
      "category": "Movement",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/monitor-screenshot.svg",
      "extensionName": "StayOnScreen",
      "description": "Force the object to stay visible on the screen by setting back its position inside the viewport of the camera.",
      "objectType": ""
    },
    {
      "tier": "reviewed",
      "authorIds": [
        "2OwwM8ToR9dx9RJ2sAKTcrLmCB92"
      ],
      "extensionNamespace": "",
      "fullName": "Mobile virtual keyboard for Text Entry",
      "name": "TextEntryVirtualKeyboard",
      "version": "0.0.1",
      "url": "https://resources.gdevelop-app.com/extensions/TextEntryVirtualKeyboard.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/TextEntryVirtualKeyboard-header.json",
      "tags": "javascript,virtual keyboard,mobile",
      "category": "User interface",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/keyboard-close.svg",
      "extensionName": "TextEntryVirtualKeyboard",
      "description": "Allow to open and close the virtual keyboard on mobile (iOS, Android). To be used on Text Entry objects.",
      "objectType": "TextEntryObject::TextEntry"
    },
    {
      "tier": "reviewed",
      "authorIds": [],
      "extensionNamespace": "",
      "fullName": "YSort",
      "name": "YSort",
      "version": "0.1.0",
      "url": "https://resources.gdevelop-app.com/extensions/YSort.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/YSort-header.json",
      "tags": "z-order,y-sort,depth,fake-depth,isometric,rpg",
      "category": "Visual effect",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/sort-ascending.svg",
      "extensionName": "YSort",
      "description": "Set the depth (Z-order) of the instance to the value of its Y position in the scene, creating an illusion of depth. The origin point of the object is used to determine the Z-order.",
      "objectType": ""
    },
    {
      "tier": "community",
      "authorIds": [
        "Zu55H5hcb9YmZTltIVOTAFDJQyB2"
      ],
      "extensionNamespace": "",
      "fullName": "Dialog Box",
      "name": "DialogBoxBackGround",
      "version": "1.0.0",
      "url": "https://resources.gdevelop-app.com/extensions/DialogBox.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/DialogBox-header.json",
      "tags": "dialog",
      "category": "General",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/Line Hero Pack/Master/SVG/UI Essentials/UI Essentials_chat_message_sms.svg",
      "extensionName": "DialogBox",
      "description": "This extension adds the functionality of a dialog box to your game.\nAdd this to the sprite object that will be the background of the dialog box.",
      "objectType": "Sprite"
    },
    {
      "tier": "community",
      "authorIds": [
        "QjE1CI3drHNR9Wklz2gTC5WbEgh1"
      ],
      "extensionNamespace": "",
      "fullName": "Draw shock waves in ellipse",
      "name": "DrawEllipseShockWave",
      "version": "0.0.3",
      "url": "https://resources.gdevelop-app.com/extensions/DrawShockWaveEffect.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/DrawShockWaveEffect-header.json",
      "tags": "Drawing,Color,Opacity,Outline",
      "category": "Advanced",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/octagram-outline.svg",
      "extensionName": "DrawShockWaveEffect",
      "description": "Will allow you to draw Ellipse shock wave effects.",
      "objectType": "PrimitiveDrawing::Drawer"
    },
    {
      "tier": "community",
      "authorIds": [
        "QjE1CI3drHNR9Wklz2gTC5WbEgh1"
      ],
      "extensionNamespace": "",
      "fullName": "Draw shock waves in star",
      "name": "DrawStarShockWave",
      "version": "0.0.3",
      "url": "https://resources.gdevelop-app.com/extensions/DrawShockWaveEffect.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/DrawShockWaveEffect-header.json",
      "tags": "Drawing,Color,Opacity,Outline",
      "category": "Advanced",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/octagram-outline.svg",
      "extensionName": "DrawShockWaveEffect",
      "description": "Will allow you to draw Star shock wave effects.",
      "objectType": "PrimitiveDrawing::Drawer"
    },
    {
      "tier": "community",
      "authorIds": [
        "QjE1CI3drHNR9Wklz2gTC5WbEgh1"
      ],
      "extensionNamespace": "",
      "fullName": "Dynamic Water Body",
      "name": "DynamicWaterBody",
      "version": "0.0.2",
      "url": "https://resources.gdevelop-app.com/extensions/DynamicWater.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/DynamicWater-header.json",
      "tags": "DynamicWater,Lava,etc",
      "category": "Advanced",
      "previewIconUrl": "https://resources.gdevelop-app.com/assets/Icons/waves.svg",
      "extensionName": "DynamicWater",
      "description": "Easily create a realistic liquid surface simulation.",
      "objectType": "Sprite"
    },
    {
      "tier": "community",
      "authorIds": [
        "IWykYNRvhCZBN3vEgKEbBPOR3Oc2",
        "gqDaZjCfevOOxBYkK6zlhtZnXCg1",
        "rotBq28wITdtfsrE7McHQri4k2w2"
      ],
      "extensionNamespace": "",
      "fullName": "Revolute joint connector",
      "name": "RevoluteJoint",
      "version": "1.0.0",
      "url": "https://resources.gdevelop-app.com/extensions/JointConnector.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/JointConnector-header.json",
      "tags": "joint,ragdoll,physics,spring,rope,weld,revolute,distance",
      "category": "General",
      "previewIconUrl": "https://asset-resources.gdevelop.io/public-resources/Icons/8834e0c63a962c74f1dab4c8f918c171261597341c4ca6574b300ab35855274b_human.svg",
      "extensionName": "JointConnector",
      "description": "Create and manage revolute joints between two objects.\nAlso known as a hinge joint because the objects act like they are connected with a hinge that pivots.",
      "objectType": ""
    },
    {
      "tier": "community",
      "authorIds": [
        "IWykYNRvhCZBN3vEgKEbBPOR3Oc2",
        "gqDaZjCfevOOxBYkK6zlhtZnXCg1",
        "rotBq28wITdtfsrE7McHQri4k2w2"
      ],
      "extensionNamespace": "",
      "fullName": "Weld joint connector",
      "name": "WeldJoint",
      "version": "1.0.0",
      "url": "https://resources.gdevelop-app.com/extensions/JointConnector.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/JointConnector-header.json",
      "tags": "joint,ragdoll,physics,spring,rope,weld,revolute,distance",
      "category": "General",
      "previewIconUrl": "https://asset-resources.gdevelop.io/public-resources/Icons/8834e0c63a962c74f1dab4c8f918c171261597341c4ca6574b300ab35855274b_human.svg",
      "extensionName": "JointConnector",
      "description": "Create and manage weld joints between two objects.\nAlso known as a static joint because the objects stay glued in the same relative position to each other.",
      "objectType": ""
    },
    {
      "tier": "community",
      "authorIds": [
        "IWykYNRvhCZBN3vEgKEbBPOR3Oc2",
        "gqDaZjCfevOOxBYkK6zlhtZnXCg1",
        "rotBq28wITdtfsrE7McHQri4k2w2"
      ],
      "extensionNamespace": "",
      "fullName": "Distance joint connector",
      "name": "DistanceJoint",
      "version": "1.0.0",
      "url": "https://resources.gdevelop-app.com/extensions/JointConnector.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/JointConnector-header.json",
      "tags": "joint,ragdoll,physics,spring,rope,weld,revolute,distance",
      "category": "General",
      "previewIconUrl": "https://asset-resources.gdevelop.io/public-resources/Icons/8834e0c63a962c74f1dab4c8f918c171261597341c4ca6574b300ab35855274b_human.svg",
      "extensionName": "JointConnector",
      "description": "Create and manage distance joints between two objects. \nActs like a spring because the objects try to stay the same distance apart.",
      "objectType": ""
    },
    {
      "tier": "community",
      "authorIds": [
        "IWykYNRvhCZBN3vEgKEbBPOR3Oc2",
        "gqDaZjCfevOOxBYkK6zlhtZnXCg1",
        "rotBq28wITdtfsrE7McHQri4k2w2"
      ],
      "extensionNamespace": "",
      "fullName": "Rope joint connector",
      "name": "RopeJoint",
      "version": "1.0.0",
      "url": "https://resources.gdevelop-app.com/extensions/JointConnector.json",
      "headerUrl": "https://resources.gdevelop-app.com/extensions/JointConnector-header.json",
      "tags": "joint,ragdoll,physics,spring,rope,weld,revolute,distance",
      "category": "General",
      "previewIconUrl": "https://asset-resources.gdevelop.io/public-resources/Icons/8834e0c63a962c74f1dab4c8f918c171261597341c4ca6574b300ab35855274b_human.svg",
      "extensionName": "JointConnector",
      "description": "Create and manage rope joints between two objects. \nObjects can get closer, but they cannot exceed the starting distance from each other.\n",
      "objectType": ""
    },
  ],
};

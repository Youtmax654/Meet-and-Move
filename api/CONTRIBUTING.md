# Contributing to Meet and Move API

Please read and follow this guide before contributing to the project.

> [!IMPORTANT]  
> You will have to create a new branch for each feature and make a pull request to the main branch when you're done.

## API Architecture

The API architecture is feature-oriented. This means that each feature has its own folder and its own routes.

```
├── 📁 features
│   └── 📁 messages
│       ├── 📄 messages.controller.ts
│       ├── 📄 messages.routes.ts
│       ├── 📄 messages.schema.ts
│       └── 📄 messages.service.ts
└── 📄 index.ts
```

## How to add a new route ?

1. Create a new folder in the `features` folder. The name of the folder should be the name of the feature.

2. Create the files inside the folder:
    - `[feature].controller.ts`: The controller handles the HTTP requests and responses.
    - `[feature].service.ts`: The service handles the business logic.
    - `[feature].schema.ts`: The schema handles the validation of the requests and responses.
    - `[feature].routes.ts`: The router handles the routing of the feature.

3. Add the new route to the `index.ts` file.

And that's all ! 🎉
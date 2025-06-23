# Dynamic App

Dynamic app is a Next.js based web application that allows the user to generate web apps with specific use cases on the go. The user can type the requirements of the app they need. 

### The apps are dynamically generated using the following workflow:

1. An input is taken from the user, which is then passed to Open ai api to generate a JSON schema.

2. A function, componentMap, is used to return react components with props. The type of component and the props are mentioned in the schema.

3. A renderComponent function is used to render the component and show it on the user interface.

### To run the project 


```
npm run dev
```

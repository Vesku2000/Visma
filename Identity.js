class IdentityApp {
    constructor(uri) {
        this.uri = uri;
    }

    // Method to parse and validate url
    parseURI() {
        // Regular expression to check the url
        const schemeRegex = /^visma-identity:\/\//;

        // path options
        const pathRegex = /^(login|confirm|sign)/;

        // Check the URI scheme
        if (!schemeRegex.test(this.uri)) {
            throw new Error('Invalid URL');
        }

        // Check the path that it is correct 
        const path = this.uri.split('?')[0].replace('visma-identity://', '');
        //if path is not correct alert error
        if (!pathRegex.test(path)) {
            throw new Error('Path error');
        }

        // Check which path need to use
        const parameters = this.uri.split('?')[1];
        switch (path) {
            case 'login':
                this.validateLoginParams(parameters);
                break;
            case 'confirm':
                this.validateConfirmParams(parameters);
                break;
            case 'sign':
                this.validateSignParams(parameters);
                break;
        }

        this.path = path;
        this.parameters = parameters;
    }

    // Method to validate the parameters for the "login" path
    validateLoginParams(parameters) {
        const sourceRegex = /^source=[a-zA-Z]+$/;
        //checking if there is something wrong chars
        if (!sourceRegex.test(parameters)) {
            throw new Error('Invalid parameters for login path');
        }
    }

    // Method to validate the parameters for the "confirm" path
    validateConfirmParams(parameters) {
        const confirmRegex = /^source=[a-zA-Z]+&paymentnumber=[0-9]+$/;
        //checking if there is something wrong chars
        if (!confirmRegex.test(parameters)) {
            throw new Error('Invalid parameters for confirm path');
        }
    }

    // Method to validate the parameters for the "sign" path
    validateSignParams(parameters) {
        const signRegex = /^source=[a-zA-Z]+&documentid=[a-zA-Z0-9]+$/;
        //checking if there is something wrong chars
        if (!signRegex.test(parameters)) {
            throw new Error('Invalid parameters for sign path');
        }
    }

    // Mehtod to return path
    getPath() {
        return this.path;
    }

    // Method to return parameters with key values
    getParameters() {
        const params = {};
        this.parameters.split('&').forEach(param => {
            const keyValue = param.split('=');
            params[keyValue[0]] = keyValue[1];
        });
        return params;
    }
}


//Define empty uri 
let uri = '';
            let identity;
            
            //functio to display path and keys
            function updateDisplay() {
                const path = identity.getPath();
                const parameters = identity.getParameters();
                //getting accces to div results
                const results = document.getElementById('results');
                //displaying content inside results div
                results.innerHTML = `
                    <p>Path: ${path}</p>
                    <ul>
                        ${Object.entries(parameters).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}
                    </ul>
                `;
            }
            //functio that sets new path to uri variable
            function changeURI(newUri) {
                uri = newUri;
                //functio creates new object with that path
                identity = new IdentityApp(uri);
                
                try {
                    identity.parseURI();
                    updateDisplay();
                } catch (error) {
                    alert("Invalid URI: " + error);
                }
            }
            

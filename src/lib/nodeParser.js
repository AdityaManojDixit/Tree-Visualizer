export default function createBSTHierarchy(nums) {
    let hierarchy = {
        name: "root",
        children: []
    };

    // Function to create a new node
    const createNode = (value) => {
        return {
            name: value,
            children: []
        };
    };

    // Function to insert a value into the BST
    const insertIntoBST = (node, value) => {
        if (value < node.name) {
            // Insert in the left subtree
            if (node.children[0]) {
                insertIntoBST(node.children[0], value);
            } else {
                const newNode = createNode(value);
                node.children[0] = newNode; // Set left child
            }
        } else {
            // Insert in the right subtree
            if (node.children[1]) {
                insertIntoBST(node.children[1], value);
            } else {
                const newNode = createNode(value);
                node.children[1] = newNode; // Set right child
            }
        }
    };

    // Initialize the BST with the first element
    hierarchy.children[0] = createNode(nums[0]); // Create the root node

    // Insert the rest of the values into the BST
    for (let i = 1; i < nums.length; i++) {
        insertIntoBST(hierarchy.children[0], nums[i]);
    }

    // Function to log hierarchy without parent references
    const logHierarchy = (node) => {
        if (!node) return null; // Check if node is null or undefined
        const newNode = { name: node.name, children: [] };
        for (let child of node.children) {
            if (child) { // Check if child is defined
                newNode.children.push(logHierarchy(child));
            }
        }
        return newNode;
    };

    // Return the hierarchy
    return logHierarchy(hierarchy.children[0]);
};
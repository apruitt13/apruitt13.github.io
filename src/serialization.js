const saveWorkspace = (workspace) => {
    return Blockly.serialization.workspaces.save(workspace);
};

const loadWorkspace = (workspace, json) => {
    Blockly.serialization.workspaces.load(json, workspace);
};

// Expose functions to the global scope for use in index.js
window.saveWorkspace = saveWorkspace;
window.loadWorkspace = loadWorkspace;

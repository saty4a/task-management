const domainName = "http://localhost:4000";

export const urls = {
    register: `${domainName}/user/register`,
    login: `${domainName}/user/login`,
    userData: `${domainName}/user/user-data`,
    setPassword: `${domainName}/user/set-password`,
    forgetPassword: `${domainName}/user/forget-password`,
    resetPassword: `${domainName}/user/reset-password`,
    addTask: `${domainName}/task/add-new-task`,
    getTasks: `${domainName}/task/all-task`,
    taskDetails: `${domainName}/task/task-details`,
    changeStatus: `${domainName}/task/update-status`,
    getAllUsers: `${domainName}/user/all-users`,
    addCollabUsers: `${domainName}/task/add-collaborate-users`,
    getCollabTasks: `${domainName}/task/get-collaborate-tasks`,
    deleteTasks: `${domainName}/task/delete`,
}
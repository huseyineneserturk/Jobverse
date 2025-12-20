module.exports = {
    apps: [
        {
            name: 'jobverse-backend',
            script: 'dist/index.js',
            cwd: '/root/Jobverse/jobverse-backend',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            },
            error_file: '/root/logs/backend-error.log',
            out_file: '/root/logs/backend-out.log',
            time: true
        }
    ]
};

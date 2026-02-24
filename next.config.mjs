/** @type {import('next').NextConfig} */
const nextConfig = {
    // Mark server-only packages as external so webpack doesn't bundle them.
    // This is the primary fix for the "Serializing big strings" warning —
    // the OpenAI SDK (and resend) embed large internal schemas that inflate
    // webpack's disk cache when serialized.
    serverExternalPackages: ["openai", "resend"],

    webpack(config, { isServer }) {
        if (isServer) {
            // Raise the threshold before webpack emits the big-string warning.
            // 500 KiB is a safe ceiling for this project.
            config.infrastructureLogging = {
                ...config.infrastructureLogging,
                level: "error", // suppress non-error infra logs
            };
        }
        return config;
    },
};

export default nextConfig;


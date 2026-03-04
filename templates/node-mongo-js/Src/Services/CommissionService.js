/**
 * CommissionService
 *
 * Helper function to get effective commission rate for a project
 * Checks project for custom rate first → if not set, use builder's default rate
 */

const CommissionService = {
    /**
     * getEffectiveCommission(project, builder)
     * Returns the effective commission percent and source
     */
    getEffectiveCommission(project, builder) {
        if (!project || !builder) {
            throw new Error("Project and Builder are required");
        }

        // If project has custom commission and doesn't use builder's default
        if (
            !project.useBuilderCommission &&
            project.customCommissionPercent !== null &&
            project.customCommissionPercent !== undefined
        ) {
            return {
                commissionPercent: project.customCommissionPercent,
                commissionSource: "project_override",
            };
        }

        // Use builder's default commission
        return {
            commissionPercent: builder.commissionPercent || 0.3,
            commissionSource: "builder_default",
        };
    },
};

export default CommissionService;

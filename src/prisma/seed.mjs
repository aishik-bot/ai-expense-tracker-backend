import prisma from "./client.mjs";

/**
 * Seeds the database with the list of roles by creating each role in the
 * database using Prisma's `create` method.
 *
 * @returns {Promise<void>} - Resolves when all roles have been created.
 */
async function main() {
    const roles = ["SUPER_ADMIN", "USER"];

    for (const role of roles) {
        await prisma.role.create({
            data: {
                name: role,
            },
        });
    }
}

main()
    .then(() => {
        console.log("Roles seeded successfully.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error seeding roles:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

import prisma from "./client.mjs";

const categories = [
    { name: "Housing" },
    { name: "Utilities" },
    { name: "Food" },
    { name: "Transportation" },
    { name: "Entertainment" },
    { name: "Health" },
    { name: "Education" },
    { name: "Shopping" },
    { name: "Travel" },
    { name: "Miscellaneous" },
];

async function seedCategories() {
    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: category,
        });
    }
}

seedCategories()
    .then(() => console.log("Categories seeded successfully"))
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../App/Common/Prisma";

export const seedSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await prisma.user.findFirst({
      where: {
        email: "redoy524@gmail.com",
      },
    });

    if (existingSuperAdmin) {
      console.log("Super Admin already exists!");
    } else {
      const hashedPassword = await bcrypt.hash("redoy524", 12);

      const newSuperAdmin = await prisma.user.create({
        data: {
          email: "redoy524@gmail.com",
          password: hashedPassword,
          name: "Redoy",
          role: UserRole.admin,
          needPasswordChange: false,
          status: "ACTIVE",
        },
      });

      console.log("Super Admin created successfully!", newSuperAdmin);
    }
  } catch (err) {
    console.error("Error creating Super Admin:", err);
  } finally {
    await prisma.$disconnect();
  }
};

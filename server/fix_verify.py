import os

filepath = r"c:\Users\User\Desktop\Backend\authforge\server\controllers\authController.js"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target = """        const backendUrl =
            process.env.BACKEND_URL ||
            `http://localhost:${process.env.PORT || 5000}`;

        const verificationUrl =
            `${backendUrl}/api/auth/verify-email?token=${verificationToken}`;"""

replacement = """        const frontendUrl =
            process.env.FRONTEND_URL ||
            "http://localhost:5173";

        const verificationUrl =
            `${frontendUrl}/verify-email?token=${verificationToken}`;"""

content = content.replace(target, replacement)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Replacement successful.")

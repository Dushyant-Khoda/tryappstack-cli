const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { ensureInsideProject, toPascalCase } = require("../utils/helpers");

function addTemplatesCommand(name) {
    ensureInsideProject();

    const Name = toPascalCase(name);
    const fileName = `${Name}`;
    const filePath = path.resolve(process.cwd(), `Src/Templates/${fileName}.html`);

    // Ensure Templates directory exists
    const templatesDir = path.resolve(process.cwd(), "Src/Templates");
    if (!fs.existsSync(templatesDir)) {
        fs.mkdirSync(templatesDir, { recursive: true });
    }

    if (fs.existsSync(filePath)) {
        console.log(chalk.yellow(`\n⚠  ${fileName}.html already exists.\n`));
        process.exit(0);
    }

    const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${Name} Template</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    h1 { color: #333; }
    p { color: #666; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${Name}</h1>
    <p>This is the ${Name} template. Customize it as needed.</p>
    <!-- Use {{variable}} for handlebars templating -->
  </div>
</body>
</html>
`;

    fs.writeFileSync(filePath, template, "utf-8");
    console.log(chalk.green(`  ✔ Created Src/Templates/${fileName}.html`));

    console.log(chalk.bold.green(`\n✅ Template "${fileName}.html" created successfully!\n`));
}

module.exports = addTemplatesCommand;

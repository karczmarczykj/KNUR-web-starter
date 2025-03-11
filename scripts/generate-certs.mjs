import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const certDir = path.join(__dirname, '..', 'dist', 'certificates');

function generateCertificates() {
  const keyPath = path.join(certDir, 'private.key');
  const certPath = path.join(certDir, 'certificate.crt');
  const csrPath = path.join(certDir, 'csr.pem');

  try {
    execSync(`openssl genrsa -out ${keyPath} 2048`);
    execSync(`openssl req -new -key ${keyPath} -out ${csrPath} -subj "/C=US/ST=Mazowieckie/L=Warsaw/O=FlowCortex/OU=Development/CN=localhost"`);
    execSync(`openssl x509 -req -days 365 -in ${csrPath} -signkey ${keyPath} -out ${certPath}`);
    console.log('Certificates generated successfully.');
  } catch (error) {
    console.error('Error generating certificates:', error);
  }
}

function clearDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
}

if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
  console.log(`Directory ${certDir} created.`);
  generateCertificates();
} else {
  fs.readdir(certDir, async (err, files) => {
    if (err) throw err;
    if (files.length > 0) {
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'clear',
          message: 'The cert directory already exists and contains files. Do you want to clear the directory and generate new certificates?',
          default: false,
        },
      ]);

      if (answers.clear) {
        clearDirectory(certDir);
        generateCertificates();
      } else {
        console.log('Operation cancelled.');
      }
    } else {
      generateCertificates();
    }
  });
}

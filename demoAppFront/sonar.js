
const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner(
  {
    serverUrl: 'http://localhost:9001', // Adresse du serveur SonarQube
    token: process.env.SONAR_TOKEN, // Utilisation du Token via variable d'environnement
    options: {
      'sonar.projectKey': 'demoAppFront',
      'sonar.projectName': 'demoAppFront',
      'sonar.projectVersion': '1.0',
      'sonar.sources': 'src',
      'sonar.inclusions': '**/*.ts, **/*.html, **/*.scss',
      'sonar.exclusions': '**/*.spec.ts, **/node_modules/**, **/dist/**',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info'
    },
  },
  () => process.exit()
);

const fs = require('fs');
const path = require('path');

const pages = [
  'DashboardStream',
  'ApprovalsPage',
  'DepositsPage',
  'FailedPaymentsPage',
  'FinancePage',
  'TransactionsPage',
  'WithdrawalsPage',
  'CommissionsPage',
  'IBOverviewPage',
  'IBPerformancePage',
  'IBSystemPage',
  'PayoutsPage',
  'ReferralsPage',
  'KYCQueuePage',
  'EvaluationRequestsPage',
  'FeesCouponsPage',
  'FundedAccountsPage',
  'PropTradingPage',
  'StatisticsPage',
  'FinanceReportsPage',
  'ReportsPage',
  'SystemReportsPage',
  'TradingReportsPage',
  'UserReportsPage',
  'AdminUsersPage',
  'PermissionsPage',
  'RolesPage',
  'SettingsPage',
  'EscalatedPage',
  'SupportPage',
  'TicketsPage',
  'ExecutionLogsPage',
  'OrdersPage',
  'PositionsPage',
  'TradeHistoryPage',
  'TradingAccountsPage',
  'MT5QueuePage',
  'UsersPage'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  for (const page of pages) {
    const regex = new RegExp(`import\\s+\\{\\s*${page}\\s*\\}\\s+from`, 'g');
    if (regex.test(content)) {
      console.log(`Fixing import for ${page} in ${filePath}`);
      content = content.replace(regex, `import ${page} from`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));

export const strategiesData = [
  { id:'STR-001', name:'Apex Scalper Pro',     provider:'Rehan Capital',   pid:'IB-001', followers:1842, copiedVol:'$4.2M', winRate:'68.4%', winRateN:68.4, drawdown:'-3.1%', ddN:3.1,  roi:'+28.4%', roiN:28.4, status:'ACTIVE',   risk:'LOW',  minDeposit:'$500',  fee:'20%', lastUpdated:'2 min ago',  phase:'Phase-2', aum:'$1.84M', rating:4.9, tags:['forex','scalping'] },
  { id:'STR-002', name:'Gold Trend Master',    provider:'Apex Markets',    pid:'IB-002', followers:1204, copiedVol:'$2.8M', winRate:'61.2%', winRateN:61.2, drawdown:'-5.4%', ddN:5.4,  roi:'+19.2%', roiN:19.2, status:'ACTIVE',   risk:'MED',  minDeposit:'$1000', fee:'25%', lastUpdated:'8 min ago',  phase:'Phase-2', aum:'$980K',  rating:4.6, tags:['xau','trend']  },
  { id:'STR-003', name:'FinEdge Multi-Asset',  provider:'FinEdge Global',  pid:'IB-003', followers:982,  copiedVol:'$2.1M', winRate:'58.8%', winRateN:58.8, drawdown:'-6.2%', ddN:6.2,  roi:'+14.6%', roiN:14.6, status:'ACTIVE',   risk:'MED',  minDeposit:'$500',  fee:'20%', lastUpdated:'22 min ago', phase:'Phase-2', aum:'$820K',  rating:4.4, tags:['multi','diversified'] },
  { id:'STR-004', name:'Bridge Momentum FX',   provider:'TradeBridge SG',  pid:'IB-004', followers:721,  copiedVol:'$1.6M', winRate:'54.1%', winRateN:54.1, drawdown:'-8.8%', ddN:8.8,  roi:'+11.1%', roiN:11.1, status:'ACTIVE',   risk:'HIGH', minDeposit:'$2000', fee:'30%', lastUpdated:'1h ago',     phase:'Phase-1', aum:'$640K',  rating:4.1, tags:['momentum','fx'] },
  { id:'STR-005', name:'Euro Steady Growth',   provider:'Euro IB Net',     pid:'IB-005', followers:588,  copiedVol:'$1.1M', winRate:'62.3%', winRateN:62.3, drawdown:'-4.1%', ddN:4.1,  roi:'+16.8%', roiN:16.8, status:'PAUSED',   risk:'LOW',  minDeposit:'$500',  fee:'20%', lastUpdated:'3h ago',     phase:'Phase-1', aum:'$512K',  rating:4.3, tags:['eur','steady']  },
  { id:'STR-006', name:'Nile FX Aggressive',   provider:'Nile Trading EG', pid:'IB-006', followers:340,  copiedVol:'$620K', winRate:'48.2%', winRateN:48.2, drawdown:'-14.2%',ddN:14.2, roi:'+8.4%',  roiN:8.4,  status:'REVIEW',   risk:'HIGH', minDeposit:'$500',  fee:'25%', lastUpdated:'5h ago',     phase:'Phase-1', aum:'$280K',  rating:3.8, tags:['aggressive','nile'] },
  { id:'STR-007', name:'Pacific Carry Trade',  provider:'Pacific Refs',    pid:'IB-007', followers:212,  copiedVol:'$380K', winRate:'55.6%', winRateN:55.6, drawdown:'-7.9%', ddN:7.9,  roi:'+12.3%', roiN:12.3, status:'ACTIVE',   risk:'MED',  minDeposit:'$1000', fee:'20%', lastUpdated:'6h ago',     phase:'Phase-1', aum:'$210K',  rating:4.0, tags:['carry','pacific'] },
  { id:'STR-008', name:'Atlas Conservative',   provider:'Atlas IB Group',  pid:'IB-008', followers:104,  copiedVol:'$180K', winRate:'71.2%', winRateN:71.2, drawdown:'-2.2%', ddN:2.2,  roi:'+9.1%',  roiN:9.1,  status:'SUSPENDED',risk:'LOW',  minDeposit:'$300',  fee:'15%', lastUpdated:'8h ago',     phase:'N/A',     aum:'$92K',   rating:3.2, tags:['conservative'] },
];

export const strPerf = [
  { m:'Jan', roi:4.2, dd:-1.1 },{ m:'Feb', roi:6.8, dd:-2.4 },{ m:'Mar', roi:3.1, dd:-3.8 },
  { m:'Apr', roi:8.2, dd:-1.8 },{ m:'May', roi:5.4, dd:-2.2 },{ m:'Jun', roi:7.1, dd:-1.4 },
  { m:'Jul', roi:9.4, dd:-3.1 },{ m:'Aug', roi:6.2, dd:-2.0 },
];

export const strActivityLog = [
  { ts:'2024-08-01 14:22', event:'STATUS_CHANGE',  detail:'Strategy status PAUSED → ACTIVE',        by:'admin@sys' },
  { ts:'2024-08-01 10:12', event:'FEE_UPDATE',     detail:'Performance fee updated 18% → 20%',      by:'admin@sys' },
  { ts:'2024-07-31 18:00', event:'FOLLOWER_JOIN',  detail:'New follower UID-8821 subscribed',        by:'system'    },
  { ts:'2024-07-30 09:00', event:'RISK_REVIEW',    detail:'Risk profile reviewed — LOW maintained',  by:'Keiran L.' },
  { ts:'2024-07-28 14:44', event:'PUBLISH',        detail:'Strategy published to marketplace',       by:'admin@sys' },
];

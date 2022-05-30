// Use for unit tests

module.exports = [
  // {
  //   cards: 'S5,S8,S0,SJ,SK,HA,H6,H7,HK,D8,D0,DQ,C3',
  //   // Runs: None
  //   // Sets: None
  //   total: 98
  //   // Passes!
  // },
  // {
  //   cards: 'S9,SJ,H5,D3,D5,D7,D0,C2,C6,C7,C8,CJ,CQ',
  //   // Runs: [C6,C7,C8]
  //   // Sets: None
  //   total: 71
  //   // Passes!
  // },
  // {
  //   cards:'S4,S5,S6,S8,SK,D0,DJ,DQ,DK,CA,C3,C8,C9',
  //   // Runs: [S4,S5,S6], [D0,DJ,DQ,DK]
  //   // Sets: None
  //   total: 39
  //   // Passes!
  // },
  // {
  //   cards: 'S2,S6,S8,S0,H8,H0,HK,D2,D4,C3,C8,C9,CK',
  //   // Runs: None
  //   // Sets: [S8,H8,C8]
  //   total: 66
  //   // Passes!
  // },
  // {
  //   cards: 'S6,S8,S0,SQ,SK,H4,H6,H8,HJ,C2,C6,C8,CK',
  //   // Runs: None
  //   // Sets: [S6,H6,C6], [S8,H8,C8]
  //   total: 56
  //   // Passes!
  // },
  {
    cards: 'S8,H5,H7,H8,HJ,D3,DQ,DK,C5,C6,C8,C9,C0',
    // Runs: [C8,C9,C0]
    // Sets: None
    total: 72
    // Conflict with [S8,H8,C8]
  },
  // {
  //   cards: 'S4,S7,S8,S9,S0,HA,H9,HK,DQ,C4,C6,C7,C9',
  //   // Runs: [S7,S8,S9,S0]
  //   // Sets: None
  //   total: 60
  //   // Conflict with [S9,H9,C9]
  // },
  // {
  //   cards: 'S2,S7,SJ,SK,H6,H9,H0,HJ,D3,D4,D5,DK,CJ',
  //   // Runs: [D3,D4,D5]
  //   // Sets: [SJ,HJ,CJ]
  //   total: 64
  //   //Conflict with [H9,H0,HJ]
  // },
  // {
  //   cards: 'S5,S8,SJ,SQ,SK,H0,HQ,D9,DK,C5,C9,CQ,CK',
  //   // Runs: None
  //   // Sets: [SQ,HQ,CQ], [SK,DK,CK]
  //   total: 56
  //   // Conflicts with  [SJ,SQ,SK]
  // },
];

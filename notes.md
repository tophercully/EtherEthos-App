## Example of send try/catch block
try {
    await uriContractUser.methods.SHAPESHIFT(tok_Id, shiftState).send(
      {
        from: currentAccount
      },
      function (err, res) {
        if (err) {
          console.log(err);
          return;
        }
      }
    );
} catch (errorMessage) {
    error = true;
}


## Raw Ether Ethos Array Map
const dataLegend = 
  [
    [
      alias,
      account_detail,
      social,
      website,
      gallery,
      link_priority,
      pfp_contract,
      pfp_id,
      ping
    ],
    [
      link,
      link_detail
    ],
    [
      EOA,
      EOA_detail
    ], 
    [
      respecter account], 
      [respecting account
    ],
    [
      note,
      note_detail], 
    [
      tag
    ], 
    [
      badge,
      badge_detail
    ], 
    [
      custom
    ]
  ];

import axios from "axios";

// curl https://virulent-smart-dream.discover.quiknode.pro/bf18a1026d8aa87ae439779802efb92be937e564/ \
//   -X POST \
//   -H "Content-Type: application/json" \
//   -H "x-qn-api-version: 1" \
//   --data '{
//     "id":67,
//     "jsonrpc":"2.0",
//     "method":"qn_getTokenMetadataByContractAddress",
//     "params":{
//       "contract": "0x4d224452801ACEd8B2F0aebE155379bb5D594381"
//     }
//   }'

export function callQuickNodeTokenAPI() {
  axios
    .get("https://jsonplaceholder.typicode.com/todos/1")
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}

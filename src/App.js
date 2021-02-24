import InfinityDonut from './Donut'
const coins = {
  "BTC":{
    "decimals":8,
    "amount":"23924.44",
    "amountUSD":"234234.234",
    "color":"blue",
    "symbol":"BTC"
  },
  "SHARD":{
    "decimals":8,
    "amount":"113924.44",
    "amountUSD":"234234.234",
    "color":"green",
    "symbol":"SHARD"
  },
  "LTC":{
    "decimals":8,
    "amount":"392224.44",
    "amountUSD":"234234.234",
    "color":"pink",
    "symbol":"LTC"
  },
  "ETH":{
    "decimals":8,
    "amount":"392224.44",
    "amountUSD":"234234.234",
    "color":"red",
    "symbol":"ETH"
  }
}
export function App(){

  return (<InfinityDonut
          size={500}
          amounts={coins}
          decimals={2}
          />
    )
}

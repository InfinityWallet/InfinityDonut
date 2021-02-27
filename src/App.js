import InfinityDonut from './Donut'
const coins = {
  "BTC":{
    "decimals":8,
    "amount":"40.44",
    "amountUSD":"234234.234",
    "color":"blue",
    "symbol":"BTC"
  },
  "SHARD":{
    "decimals":8,
    "amount":"40.44",
    "amountUSD":"234234.234",
    "color":"green",
    "symbol":"SHARD"
  },
  "LTC":{
    "decimals":8,
    "amount":"40.44",
    "amountUSD":"234234.234",
    "color":"pink",
    "symbol":"LTC"
  },
  "ETH":{
    "decimals":8,
    "amount":"1.44",
    "amountUSD":"234234.234",
    "color":"red",
    "symbol":"ETH"
  },
  "ERE":{
    "decimals":8,
    "amount":"1.44",
    "amountUSD":"234234.234",
    "color":"pink",
    "symbol":"ERE"
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

import InfinityDonut from './Donut'
const coins = {
  "BTC":{
    "decimals":8,
    "amount":"430.44",
    "amountUSD":"430.234",
    "color":"blue",
    "symbol":"BTC"
  },
  "SHARD":{
    "decimals":8,
    "amount":"404.44",
    "amountUSD":"430.234",
    "color":"green",
    "symbol":"SHARD"
  },
  "LTC":{
    "decimals":8,
    "amount":"430.44",
    "amountUSD":"480.234",
    "color":"pink",
    "symbol":"LTC"
  },
  "ETH":{
    "decimals":8,
    "amount":"13.44",
    "amountUSD":"13.234",
    "color":"red",
    "symbol":"ETH"
  },
  "ERE":{
    "decimals":8,
    "amount":"31.44",
    "amountUSD":"13.234",
    "color":"pink",
    "symbol":"ERE"
  }
}
export function App(){

  return (<InfinityDonut
          amounts={coins}
          width={400}
          height={400}

          decimals={2}
          fontFamily="'Inter var'"
secondFontColor={"#1890ff"}
title={"'Inter var'"}
thirdFontColor={"#2c3753db"}
backgroundColor={"#000000"}
fontColor={"#eeeeee"}
size={1}
          />
    )
}

import BigNumber from 'bignumber.js'
import React, { useState, useEffect, useRef } from 'react';

export function isBig(){
  if(window.innerWidth > 1350)
    return 4;
  return 2;
}
export function preparePrice(price, decimals){
  var res = new BigNumber(price)

  if(isNaN(price))
    return "0.00"
  if(decimals == 8)
  {
    if(Math.abs(res.toNumber()) == 0){
      return "0.00"
    }
    else
      return res.toFormatSpecial(8)
  }
  else{
    return prepareAmount(price)
  }
}

export function sortBalances(balances){
  return Object.keys(balances).sort(function(a,b){
      var a_b = balances[a]
      var b_b = balances[b]
      if(a_b > b_b)
        return -1;
      else if(a_b < b_b)
        return 1;
      return 0
  });
}
export function prepareAmount(price){
  var res = new BigNumber(price)
  if(Math.abs(res.toNumber()) == 0){
    res = "0.00"
  }
  else if(Math.abs(res.toNumber()) < 0.01)
    res = res.toFormatSpecial(6)
  else if(Math.abs(res.toNumber())  < 1){
    res = res.toFormatSpecial(4)
  }
  else{
    res = res.toFormatSpecial(2)
  }
  return res;
}

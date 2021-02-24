import React from 'react';
import './index.css'
import ReactResizeDetector from 'react-resize-detector';
import BigNumber from "bignumber.js"

function isBig(){
  if(window.innerWidth > 1350)
    return 4;
  return 2;
}
function preparePrice(price, decimals){
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
function prepareAmount(price){
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
BigNumber.prototype.toFormatSpecial = function(decimals){
  var dd = this.toFormat(decimals)
  if(dd == undefined)
    dd = ''
  var rightSide = ''
  if(dd.split('.').length > 1){
    rightSide = dd.split('.')[1].split("").reverse().join("");
    rightSide =rightSide.replace(/^0+/, '');
    if(rightSide.length == 0)
      rightSide = "00"
    else if(rightSide.length == 1)
      rightSide = "0"+rightSide
  }
  return dd.split('.')[0]+"."+rightSide.split("").reverse().join("")
}
class InfinityDonut extends React.Component {
    constructor(props) {
        super(props)
        this.updateCanvas = this.updateCanvas.bind(this);
        this.calculateValues = this.calculateValues.bind(this);
        this.hoverCircle = this.hoverCircle.bind(this);
        this.canvas = React.createRef();
        this.container = React.createRef();
        this.clearHover = this.clearHover.bind(this);
        this.firstLoad = true;
        this.clearCanvas = this.clearCanvas.bind(this)
        this.updating = false;
        this.resizeState = this.resizeState.bind(this)
        this.points = {}
        this.widths = {}
        this.drawSegments = {};
        this.total_circle = 0.1 * Math.PI
        this.drawOuts = {}
        this.size = props.size == undefined ? 1 : props.size
        this.state = {
          width: props.width == undefined ? 400 : props.width,
          height: props.height == undefined ? 400 : props.height,
          hovering: false,
          coin: '',
          title:props.title == undefined ? "Title" : props.title,
          amounts:props.amounts,
          fontColor:props.fontColor != undefined ? props.fontColor : "#000000",
          secondFontColor:props.secondFontColor != undefined ? props.secondFontColor : "#FF0000",
          backgroundColor:props.backgroundColor != undefined ? props.backgroundColor : "#0FF000",
          thirdFontColor:props.thirdFontColor != undefined ? props.thirdFontColor : "#000FF0",
          fontFamily:props.fontFamily != undefined ? props.fontFamily : "Arial",
          currency: props.currency != undefined ? props.currency : {
            symbol:"$",
            decimals:2,
            rate:1
          }
        }
        this.animate_in_value = 5;
        this.changeAmounts=this.changeAmounts.bind(this)
        this.changeCurrency=this.changeCurrency.bind(this)
    }

    clearHover() {
      this.hovering = false;
      this.animate_in_value = 5;
      this.updateCanvas();
      this.setState({ hovering: false })
    }
    clearCanvas() {
        if (this.canvas.current != undefined) {
            const ctx = this.canvas.current.getContext('2d');
            ctx.clearRect(0, 0, this.state.width, this.state.height);
        }
    }

    hoverCircle(e) {
        var x = e.nativeEvent.offsetX
        var y = e.nativeEvent.offsetY

        var x_center = this.state.width / 2;
        var y_center = this.state.width / 2;

        var radius = ((this.state.width / 2) - 8);
        var distanceX = x_center - x;
        var distanceY = y_center - y;
        if(this.num_assets == 0)
          return;
        var distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
        if (Math.abs(distance - radius) < 10) {
            var angle = Math.PI + Math.atan2(distanceY, distanceX);
            var keys = Object.keys(this.drawSegments)
            for (var i = 0; i < keys.length; i++) {
                var start = this.drawSegments[keys[i]][0];
                var end = this.drawSegments[keys[i]][1];
                if (angle >= start && angle <= end) {
                    if (!this.hovering || this.coin != keys[i]) {
                        this.hovering = true;

                        this.animate_in = keys[i];
                        this.animate_in_value = 5;
                        this.coin = keys[i];
                        this.updateCanvas();
                        this.setState({ hovering: true, coin: keys[i] })

                    }
                    return;
                }
            }
        }
        else if (this.hovering) {
            this.hovering = false;
            this.animate_in_value = 5;
            this.updateCanvas();
            this.setState({ hovering: false })

        }
    }
    resizeState(width,height) {
        var ts =this;
        this.setState({
            width: Math.min(width,height),
            height: Math.min(width,height)
        },function(){
          ts.updateCanvas()
        })
    }
    componentDidMount() {
        this.calculateValues();
        this.interval = setInterval(this.updateCanvas, 1000 / 60);
    }


    componentWillMount() {
        this.lastSelect = this.state.title
        window.clearInterval(this.interval);
    }
    componentWillUnmount() {

      window.clearInterval(this.interval);
    }
    calculateValues() {
        this.firstLoad = false;
        var start = new Date();

        var coins_b = this.state.amounts
        if (coins_b == undefined)
            return;

        this.total_balance = 0.0;
        var keys = Object.keys(coins_b);
        this.drawSegments = {}
        this.balances = {};
        for (var i = 0; i < keys.length; i++) {

            if (coins_b[keys[i]] != undefined) {
                this.total_balance += parseFloat(coins_b[keys[i]].amount);
            }
        }
        this.others = [];
        this.num_assets = 0;
        if (this.total_balance > 0) {
          for (var i = 0; i < keys.length; i++) {

            var bal = parseFloat(coins_b[keys[i]].amount);
            if (coins_b[keys[i]] == undefined || bal == 0) {
                continue;
            }
            if (bal / this.total_balance < 0.01) {
                if (this.balances["others"] == undefined)
                    this.balances["others"] = 0;
                this.balances["others"] += parseFloat(coins_b[keys[i]].amount);
                this.others[keys[i]] = parseFloat(coins_b[keys[i]].amount);

            }
            else
                this.balances[keys[i]] = coins_b[keys[i]].amount;
            this.num_assets += 1;
          }
        }
        else{
          this.balances["others"] = 0;
        }

        //console.log(this.balances)


        this.updateCanvas();
    }
    updateCanvas() {
        this.clearCanvas();
        if (this.balances == undefined)
            return;
        if (this.canvas.current == undefined)
            return;
        const context = this.canvas.current.getContext('2d')
        if(this.balances["others"] != undefined && this.balances["others"] >= 0 && this.balances["others"] / this.total_balance < 0.005){
          this.total_balance -= this.balances["others"];
          this.balances["others"] = undefined;
          var assets = Object.keys(this.others).length;
          this.num_assets -= assets;
          this.others = {};
        }
        var all_state = true;

        var total_circle = this.total_circle * 1.1;
        this.total_circle = total_circle;
        if (this.total_circle >= 2 * Math.PI) {
            this.total_circle = 2 * Math.PI
            total_circle = 2 * Math.PI
        }
        else{
            all_state = false;
        }
        var already_draw = 0;
        context.lineWidth = 5;
        var separation = 2.0 * Math.PI * 0.007;
        var ts =this;
        var keys = Object.keys(this.balances);
        keys = keys.sort(function(a,b){
          var a_b = ts.balances[a]
          var b_b = ts.balances[b]
          if(a_b > b_b)
            return -1;
          else if(a_b < b_b)
            return 1;
          return 0
        })
        var num_ncero = 0;
        for (var i = 0; i < keys.length; i++) {
            if (this.balances[keys[i]] > 0)
                num_ncero += 1;
        }
        if (num_ncero == 1)
            num_ncero = 0;
        total_circle -= separation * num_ncero;
        for (var i = 0; i < keys.length; i++) {
          if(this.balances[keys[i]] == undefined)
          continue;
            var segment = 1;
            if (this.total_balance > 0)
                segment = parseFloat(this.balances[keys[i]]) / this.total_balance;
            segment *= total_circle;
            context.beginPath();
            if (this.hovering && this.coin == keys[i])
                context.lineWidth = this.animate_in_value*this.size;
            else
                context.lineWidth = this.drawOuts[keys[i]]*this.size;

            if (keys[i] != "others"){
                context.strokeStyle = this.state.amounts[keys[i]]["color"];
            }
            else{
              context.strokeStyle =  this.state.fontColor
            }

            this.drawSegments[keys[i]] = [already_draw, already_draw + segment];
            if (this.drawOuts[keys[i]] == undefined)
                this.drawOuts[keys[i]] = 5;
            this.drawOuts[keys[i]] = this.drawOuts[keys[i]] * 0.9;
            if (this.drawOuts[keys[i]] < 5)
                this.drawOuts[keys[i]] = 5;
            context.arc(this.state.width / 2, this.state.width / 2, ((this.state.width / 2) - (8*this.size)), already_draw , already_draw + segment, false);
            already_draw += (segment + separation);
            if(this.drawOuts[keys[i]] != 5)
              all_state = false;
            context.stroke();
            context.closePath();
        }
        var font_second =this.state.secondFontColor;
        var clear = this.state.backgroundColor;
        var blue_clear = this.state.thirdFontColor;

        if (!this.hovering) {
            context.beginPath();
            context.fillStyle = clear
            context.font = "29px "+this.state.fontFamily;
            var size_aux = 29;
            if (this.state.width <= 370) {
                context.font = "25px "+this.state.fontFamily;
                size_aux = 25;
            }
            if (this.state.width <= 330) {
                context.font = "19px "+this.state.fontFamily;
                size_aux = 21;
            }
            var balance_wallet = preparePrice(this.total_balance * this.state.currency.rate, this.state.currency.decimals)
            var bal = this.state.currency.symbol  +  balance_wallet;
            var measure_text = context.measureText(bal)
            context.fillText(bal, this.state.width / 2 - (measure_text.width * 0.5), (this.state.width / 2)+ 10)
            context.closePath();
            context.beginPath();
            context.fillStyle = font_second
            context.font = "19px "+this.state.fontFamily;
            var aux_aux_size = 18
            if (this.state.width <= 370) {
                context.font = "15px "+this.state.fontFamily;
                aux_aux_size = 14
            }
            var texto = this.num_assets + " Assets"
            measure_text = context.measureText(texto)
            context.fillText(texto, this.state.width / 2 - (measure_text.width * 0.5), this.state.width / 2 + (aux_aux_size*0.5) + (size_aux*0.5) +10 + 10)
            context.closePath();
            context.beginPath();
            context.fillStyle = blue_clear
            context.font = "19px "+this.state.fontFamily;
            var aux_aux_size = 18
            if (this.state.width <= 370) {
                context.font = "15px "+this.state.fontFamily;
                aux_aux_size = 14
            }
            var texto = this.state.title
            measure_text = context.measureText(texto)
            context.fillText(texto, this.state.width / 2 - (measure_text.width * 0.5), (this.state.width / 2) - 10 - (aux_aux_size*0.75) - (size_aux * 0.5) + 8)
            context.closePath();
            if(all_state){
              window.clearInterval(this.interval);
              this.paused = true;
            }
        }
        else {
            if(this.paused){
              this.interval = setInterval(this.updateCanvas, 1000 / 60);
              this.paused = false;
            }
            context.beginPath();

            context.fillStyle = clear
            context.font = "27px "+this.state.fontFamily;
            var size_aux = 27;
            if (this.state.width <= 370) {
                context.font = "23px "+this.state.fontFamily;
                size_aux = 23;
            }
            if (this.state.width <= 330) {
                context.font = "19px "+this.state.fontFamily;
                size_aux = 19;
            }

            if (this.coin != "others") {
                var coin_target = this.state.amounts[this.coin];
                context.fillStyle = coin_target["color"]
                var tag = " " + coin_target["symbol"];
                var bal = parseFloat(coin_target.amount)
                if(bal == 0)
                {
                  bal =bal.toFixed(2) + tag
                }
                else if(bal < 0.0001 && coin_target.decimals >= 8){
                  bal =bal.toFixed(8) + tag
                }
                else if(bal < 0.001 && coin_target.decimals >= 6){
                  bal =bal.toFixed(6) + tag
                }
                else if(bal < 10 && coin_target.decimals >= 4)
                  bal =bal.toFixed(4) + tag
                else{
                  bal =bal.toFixed(2) + tag
                }
                var measure_text = context.measureText(bal)

                context.fillText(bal, this.state.width / 2 - (measure_text.width * 0.5), this.state.width / 2  - 2)
            }
            else {
                var measure_text = context.measureText("Others")
                context.fillText(measure_text, this.state.width / 2 - (measure_text.width * 0.5), this.state.width / 2 - 4)
            }
            context.closePath();
            context.beginPath();
            context.fillStyle = clear
            context.font = "21px "+this.state.fontFamily;
            var aux_aux_size = 21
            if (this.state.width <= 370) {
                context.font = "15px "+this.state.fontFamily;
                aux_aux_size = 17
            }
            var bal = this.state.currency.symbol + preparePrice(this.state.amounts[this.coin].amountUSD * this.state.currency.rate,this.state.currency.decimals);
            var measure_text = context.measureText(bal)
            context.fillText(bal, this.state.width / 2 - (measure_text.width * 0.5), this.state.width / 2 + (aux_aux_size * 0.5) + (size_aux * 0.5) + 10-2)
            context.closePath();
        }
        if (this.hovering) {
            this.animate_in_value += 1.1;
            if (this.animate_in_value > 14) {
                this.animate_in_value = 14;
            }
            this.drawOuts[this.animate_in] = this.animate_in_value

        }




    }
    changeAmounts(amounts){
      var ts =this;
      this.setState({amounts},function(){
        ts.calculateValues()
      })
    }
    changeCurrency(currency){
      var ts =this;
      this.setState({currency},function(){
        ts.calculateValues()
      })
    }



    render() {
        if (this.state.hasError) {
          // You can render any custom fallback UI
          return <div style={{color:"var(--color-red)",fontSize:"var(--size-font-nine)",textAlign:"center",height:"100%",alignItems:"center",width:"100%"}}>Temporarily disabled</div>;
        }
        var cursor = "default";
        if (this.state.hovering) {
            cursor = "pointer"
        }
        return (
            <div style={{ width: "100%", height: "100%" }} className="containerCanvasCircle" ref={this.container}>
                <ReactResizeDetector handleWidth handleHeight onResize={this.resizeState} />

                <canvas width={this.state.width} onMouseLeave={this.clearHover} onMouseMove={this.hoverCircle} height={this.state.height} style={{ cursor: cursor, top: "0px" }} ref={this.canvas} />
            </div>
        );
    }
}
export default InfinityDonut;

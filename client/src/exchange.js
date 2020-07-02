import React from 'react';
import {useForm} from 'react-hook-form'
import axios from 'axios';

function Exchange() {
    const [status, setStatus] = React.useState("pre");
    const [data, setData] = React.useState({});

    const onSubmit = async data => {
        if (!validateData(data)) return;
        setStatus("waiting");
        const result = await getExchange(data);
        setData(result);
        setStatus("result")
    }
  return (
    <React.Fragment>
        <h1>Exchange Currencies</h1>
        {ExchangeForm(onSubmit)}
        <br></br>
        {ExchangeResults(status,data)}
    </React.Fragment>
  );
}

function ExchangeForm(onSubmit) {
    const {register, handleSubmit} = useForm();
    return(
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label> {"From Currency:  "}
                    <select ref={register} onChange={handleSubmit(onSubmit)} name="from">
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="ILS">ILS</option>
                    </select>
                </label>
                <br></br>
                <label> {"To Currency:  "} 
                    <select ref={register} onChange={handleSubmit(onSubmit)} name="to">
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="ILS">ILS</option>
                    </select>
                </label>
                <br></br>
                <label> {"Amount to exchange:  "} 
                    <input ref={register} name="amount" type="number" min="0" onChange={handleSubmit(onSubmit)} ></input>
                </label>
            </form>
        </div>
    )
}

function ExchangeResults(status, data) {
    let show = null;
    if(status === "waiting") {
        show = "Please Wait For results";
    }
    if(status === "result")
    {
    show = <lable>
        {`The exchange rate is ${data.exchange_rate}`}
        <br></br>
        {`The amount is ${data.amount} in ${data.currency_code}`}
        </lable>
    }
    return (
        <div>
            {show}
        </div>
    )
}

async function getExchange(data) {
    const url = `http://localhost:3218/api/quote?from_currency_code=${data.from}&amount=${data.amount}&to_currency_code=${data.to}`;
    const result = await axios.get(url);
    return result.data;
}

function validateData (data) {
    return data.from && data.to && data.amount && data.from !== data.to && Number(data.amount);
}
export default Exchange;

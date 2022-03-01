import axios from "axios";
import { useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import Error from "../components/Error";

const Input = styled.input`
    display: block;
    margin: 15px auto;
    padding: 5px;
    color: white;
    background: rgb(80, 80, 80);
    border: solid 1px rgb(80, 80, 80);
    &:focus {
        border: solid 1px white;
        outline: none;
    }
`

const Button = styled.button`
    margin: 15px auto;
    display: block;
    padding: 8px;
    color: white;
    background: rgb(80, 80, 80);;
    border: none;
    &:hover {
        background: rgb(120, 120, 120);
    }
    &:active {
        color: rgb(180, 180, 180);
    }
`

export default function Home() {

    const [error, setError] = useState({text: null, success: false});

    const registerUrl = event => {
        event.preventDefault();
        let url_name = event.target.url_name.value
        let url_link = event.target.url_link.value

        if (url_name === '' || url_link === '') {
            setError({text: 'Preencha todos os campos', success: false})
            return;
        }

        axios.post(`/api/${url_name}`, {url_link: url_link}).then((rest) => {
            console.log(rest.data.teste)
            setError({text: 'Link encurtado com sucesso', success: true})
        }).catch((error) => {
            setError({text: 'Não deu pra encurtar!', success: false})
        });
    }

    return (
        <Card>
            <form onSubmit={registerUrl} method={'post'}>
                <h1>Encurtador de Links</h1>
                <Input id={'url_name'} placeholder={'Nome do link'} />
                <Input id={'url_link'} placeholder={'URL para encurtar'} />
                <Error text={error.text} success={error.success}></Error>
                <Button>Encurtar</Button>
            </form>
        </Card>
    )
}
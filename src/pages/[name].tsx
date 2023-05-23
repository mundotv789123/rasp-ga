import axios from "axios";
import styled from "styled-components";
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Card from "../components/Card";

const Main = styled.div`
    width: 500px;
`

const Text = styled.h1`
    color: white;
`

const BackLink = styled.a`
    color: white;
    text-align: right;
    width: 100%;
    display: block;
    &:hover {
        text-decoration: underline;
    }
`

export default function Redirect() {
    const router = useRouter();
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!router.query.name) {
            return;
        }
        axios.get(`/api/${router.query.name}`).then((rest) => {
            location.href=rest.data.url;
        }).catch((error) => {
            if (error.toJSON().status === 404) {
                setError('Esse link não foi encontrado ou foi removido!')
                return;
            }
            setError('Erro interno ao buscar link!')
        })
    }, [router]);
    
    if (error !== null) {
        return (
            <Card styled={`width: 500px`}>
                <Main>
                    <Text>{error}</Text>
                    <BackLink href="/">Ir para página inicial</BackLink>
                </Main>
            </Card>
        )
    }
    return <p>redirecionando...</p>
}
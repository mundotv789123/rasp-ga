import styled from "styled-components";

const Cont = styled.div`
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #364e88;
`

const CardMain = styled.div`
    color: white;
    display: block;
    margin: auto;
    padding: 32px;
    border-radius: 10px;
    box-shadow: 0px 0px 5px #333;
    border-bottom: solid 3px white;
    background: rgba(0, 0, 0, 0.5);
`

export default function Card(props: any) {
    return (
        <Cont>
            <CardMain>{props.children}</CardMain>
        </Cont>
    )
}
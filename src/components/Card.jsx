import styled from "styled-components";

const Cont = styled.div`
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgb(80, 80, 80);
`

const CardMain = styled.div`
    color: white;
    display: block;
    margin: auto;
    padding: 32px;
    border-radius: 10px;
    border-left: solid 5px cadetblue;
    background: rgba(0, 0, 0, 0.5);
`

export default function Card(props) {
    return (
        <Cont>
            <CardMain>{props.children}</CardMain>
        </Cont>
    )
}
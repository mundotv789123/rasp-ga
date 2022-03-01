import styled, { keyframes } from "styled-components"

const Animation = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 100;
    }
`

const Cont = styled.div`
    text-align: center;
    border-radius: 5px;
    padding: 5px;
    width: 320px;
    animation: ${Animation} 1s normal;
`

export default function Error(props) {
    if (!props.text) {
        return <></>
    }
    return <Cont style={{background: (props.success ? 'rgba(48, 206, 95, 0.76)' : 'rgba(187, 62, 62, 0.71)')}}>{props.text}</Cont>
}
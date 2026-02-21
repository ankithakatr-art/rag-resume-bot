
import { TypeAnimation } from 'react-type-animation';
import TextContainer from "./TextContainer";

export default function ParentContainer() {
    return (<div style={{ textAlign: 'center', width: '100%' }}>
        <TypeAnimation className="heading-container" sequence={[' Hello, welcome to learning more about Ankitha!', 1000, 'Type some questions below to know more!', 10000]}
            wrapper='span' speed={10}
            style={{ fontSize: '2em', display: 'inline-block' }}
            repeat={50}
            deletionSpeed={80}
        />
        <TextContainer />
    </div>);
}
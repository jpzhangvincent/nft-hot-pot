import Link from "next/link";
import styles from "../styles/Modal.module.css";
export default function Result(props) {
    return (
        <div className={styles.Modal}>
            <div
                onClick={() => props.setResult(false)}
                className={styles.background}
            ></div>

            <div className={styles.status}>
                <p>View your transaction on Etherscan!</p> 
                <a href={props.status} target="_blank">
                    <p>{props.status}</p>
                </a>
            </div>
        </div>
    );
}
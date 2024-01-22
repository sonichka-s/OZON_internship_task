import ProgressBar from "./ProgressBar/ProgressBar";
import './styles/styles.less';

const barOptions = {
    value: 75,
    animated: false,
    hided: false
}

const ProgressBarElement = new ProgressBar('container', barOptions);

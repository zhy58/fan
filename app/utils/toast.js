import Toast from 'react-native-root-toast'

const toast = {
    duration: Toast.durations.SHORT,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    textStyle: {fontSize: 12},
    onShow: () => {
        // calls on toast\`s appear animation start
    },
    onShown: () => {
        // calls on toast\`s appear animation end.
    },
    onHide: () => {
        // calls on toast\`s hide animation start.
    },
    onHidden: () => {
        // calls on toast\`s hide animation end.
    }
}

export default showTips = (tip = "") => {
    try {
        const rootSiblings = Toast.show(tip, toast);
        setTimeout(function () {
            Toast.hide(rootSiblings);
        }, 2000);
    } catch (error) {
        console.log("showTips: ", error);
    }
    
}



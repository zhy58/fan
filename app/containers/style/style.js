import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFFFFF"
    },

    flexCenter: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    flexBetween: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    paddingH30: {
        paddingHorizontal: 30,
    },
    paddingH20: {
        paddingHorizontal: 20,
    },
    marginT20: {
        marginTop: 20,
    },
    marginT30: {
        marginTop: 30,
    },
    marginT10: {
        marginTop: 10,
    },

    bgef: {
        backgroundColor: "#EFEFEF"
    },
    grey: {
        color: "#EFEFEF"
    },
    weight: {
        fontWeight: "500",
    },
})
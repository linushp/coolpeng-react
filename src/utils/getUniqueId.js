var uniqueId = 0;
export default function getUniqueId() {
    var seed = window.APP_SERVER_SEED || (new Date().getTime() + "_" + parseInt(Math.random() * 100000));
    var result = seed + "_" + uniqueId;
    uniqueId++;
    return result;
}
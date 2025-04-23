export default function getDaysLeft({ expirationDate }: { expirationDate:Date}) {
    const date = new Date();
    const endDate = new Date(expirationDate);
    const timeDiff = endDate.getTime() - date.getTime();

    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}
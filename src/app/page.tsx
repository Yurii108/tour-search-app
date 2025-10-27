import styles from './page.module.css';
import Home from '@/components/home';

export default function HomePage() {
    return (
        <div className={styles.container}>
            <Home />
        </div>
    );
}

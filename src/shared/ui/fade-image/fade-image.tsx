import styles from './fade-image-styles.module.css';

type FadeImageProps = {
  image: string;
  bg: string;
};

export const FadeImage = ({ image, bg }: FadeImageProps) => {
  return (
    <div className={styles.container}>
      <div
        className={styles.image}
        style={
          {
            backgroundImage: `url("${image}")`,
            '--fade-bg': bg,
          } as React.CSSProperties
        }
      />
    </div>
  );
};

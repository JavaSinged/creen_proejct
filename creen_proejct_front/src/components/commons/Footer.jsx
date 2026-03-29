import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* 상단 푸터 영역 */}
        <div className={styles.top_section}>
          <div className={styles.brand_info}>
            <h2 className={styles.slogan}>" No BS, Just Clean Delivery. "</h2>
            <p className={styles.brand_name}>
              GReen Carry™ — A New Standard for Sustainable Delivery.
            </p>
            <div className={styles.sns_links}>
              <span>Instagram</span>
              <span>LinkedIn</span>
              <span>GitHub</span>
            </div>
          </div>

          <div className={styles.link_groups}>
            <div className={styles.link_column}>
              <h4>Platform</h4>
              <ul>
                <li>How it Works</li>
                <li>For Restaurants</li>
                <li>For Riders</li>
              </ul>
            </div>
            <div className={styles.link_column}>
              <h4>Impact</h4>
              <ul>
                <li>Carbon Report</li>
                <li>Forest Fund</li>
                <li>Reusable Stats</li>
              </ul>
            </div>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* 하단 푸터 영역 */}
        <div className={styles.bottom_section}>
          <div className={styles.company_info}>
            <p>
              <span className={styles.highlight}>CEO.</span> 신지웅 | Seoul, KR
              (123-45-67890)
            </p>
            <p>
              <span className={styles.highlight}>CS.</span> 1600-0000 |
              partner@greencarry.com
            </p>
          </div>

          <div className={styles.legal_info}>
            <div className={styles.legal_links}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Carbon Report</span>
            </div>
            <p className={styles.copyright}>
              © 2026. <strong>GReen Carry™</strong>. All footprints offset. 🌱
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

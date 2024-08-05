/* pages/index.js */

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return null;
};

export default IndexPage;

'use client';

import React from 'react';
import { Communities } from '../../../components';

export default function Page({ params }: { params: { id: string } }) {
    return <Communities  {...params }  />
}



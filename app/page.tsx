'use client'

import { usePdfStore } from '@/stores/usePdfStore'
import { FeatureSupportChecker } from '@/components/feature_support_checker'
import { DropZone } from '@/components/drop_zone'
import { ConversionSettings } from '@/components/conversion_settings'
import { PagesSelector } from '@/components/pages_selector'
import { Toolbar } from '@/components/toolbar'
import { PromoText } from '@/components/promo_text'

export default function Home() {
  const pageCount = usePdfStore((state) => state.pageCount)

  return (
    <>
      <FeatureSupportChecker />
      <section className={'w-full'}>
        <DropZone className={'mt-4'} />
      </section>

      <section>
        {pageCount > 0 && (
          <>
            <ConversionSettings />
            <PagesSelector className={'mt-6'} />
            <Toolbar />
          </>
        )}

        {pageCount === 0 && <PromoText />}
      </section>
    </>
  )
}

/**
 * ***************************************************************************
 * Copyright (c) 2010 Qcadoo Limited
 * Project: Qcadoo Framework
 * Version: 1.4
 *
 * This file is part of Qcadoo.
 *
 * Qcadoo is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation; either version 3 of the License,
 * or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 * ***************************************************************************
 */
package com.qcadoo.mes.techSubcontrForNegot.aop;

import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;

import com.qcadoo.mes.techSubcontrForNegot.constants.TechSubcontrForNegotConstants;
import com.qcadoo.model.api.Entity;
import com.qcadoo.plugin.api.RunIfEnabled;

@Aspect
@Configurable
@RunIfEnabled(TechSubcontrForNegotConstants.PLUGIN_IDENTIFIER)
public class OfferDetailsListenersTSFNOverrideAspect {

    @Autowired
    private OfferDetailsListenersTSFNOverrideUtil offerDetailsListenersTSFNOverrideUtil;

    @Pointcut("execution(private com.qcadoo.model.api.Entity com.qcadoo.mes.supplyNegotiations.listeners.OfferDetailsListeners.createOrderedProduct(..)) "
            + " && args(offerProduct)")
    public void createOrderedProductExecution(final Entity offerProduct) {
    }

    @AfterReturning(value = "createOrderedProductExecution(offerProduct)", returning = "orderedProduct")
    public void afterCreateDeliveredProductExecution(final Entity offerProduct, final Entity orderedProduct) {
        offerDetailsListenersTSFNOverrideUtil.fillOrderedProductOperation(offerProduct, orderedProduct);
    }

}

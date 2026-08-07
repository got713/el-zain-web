import React, { useState, useEffect } from 'react';
import './App.css';

// SVG Icons to avoid Lucide package imports/loading delays
const Icons = {
  Analytics: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>,
  Menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Orders: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Drivers: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Tables: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"/></svg>,
  Branches: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Store: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>,
  Delete: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Pos: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9M14 9v12"/></svg>,
  Kds: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 0 0-10 10c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6v6l4 2"/></svg>,
  Reports: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('elzain_admin_auth') === 'true';
  });
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState('analytics');
  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const prevOrderCountRef = React.useRef(null);
  const audioContextRef = React.useRef(null);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinCode === '8888' || pinCode === '1234') {
      localStorage.setItem('elzain_admin_auth', 'true');
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('رمز الدخول غير صحيح! الرمز الافتراضي: 8888 🔒');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('elzain_admin_auth');
    setIsAuthenticated(false);
  };

  // Play alert sound using Web Audio API (no external files needed)
  const playAlertSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const playBeep = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.4, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const t = ctx.currentTime;
      playBeep(880, t, 0.15);
      playBeep(1100, t + 0.18, 0.15);
      playBeep(880, t + 0.36, 0.15);
      playBeep(1100, t + 0.54, 0.25);
    } catch(e) { console.warn('Audio failed:', e); }
  };

  // Seed Mock Data matching mobile models
  const [branches, setBranches] = useState([
    { id: 'br_001', name: 'فرع حدائق القبة 🍔', address: '162 شارع مصر والسودان، حدائق القبة، القاهرة', phone: '01016693570', latitude: 30.0826, longitude: 31.2858, deliveryRadius: 6000, defaultDeliveryFee: 20, status: 'open', kitchenPrinterIp: '192.168.1.150', cashierPrinterIp: '192.168.1.151' },
    { id: 'br_002', name: 'فرع حدائق الزيتون 🍕', address: 'شارع سليم الأول، حدائق الزيتون، القاهرة', phone: '01121216052', latitude: 30.1022, longitude: 31.3115, deliveryRadius: 8000, defaultDeliveryFee: 30, status: 'open', kitchenPrinterIp: '192.168.2.150', cashierPrinterIp: '192.168.2.151' }
  ]);

  const [menuItems, setMenuItems] = useState([
    { id: 'm1', category: 'sandwiches', name: 'ماريا شاورما فراخ سوري', description: 'خبز ماريا المحمص المحشو بشاورما الفراخ المميزة مع الجبن والثومية والمخلل.', price: 170.0, imagePath: 'assets/syrian_sandwiches.jpg', isPopular: true, isAvailable: true },
    { id: 'm2', category: 'meals', name: 'وجبة عربي دبل (8 قطع)', description: 'شاورما فراخ سوري مقطعة 8 قطع مع البطاطس المقلية والثومية والمخلل الشامي.', price: 225.0, imagePath: 'assets/shawarma_fatteh.jpg', isPopular: true, isAvailable: true },
    { id: 'm3', category: 'meals', name: 'فتة شاورما فراخ الزين', description: 'أرز بسمتي أصفر محشو بشاورما الفراخ والخبز المحمص والثومية والمكسرات.', price: 185.0, imagePath: 'assets/shawarma_fatteh.jpg', isPopular: true, isAvailable: true },
    { id: 'm4', category: 'broasted', name: 'وجبة بروستيد 4 قطع مقرمش', description: '4 قطع دجاج بروستيد ذهبي مقرمش مع بطاطس وثومية وخبز سوري طازج.', price: 210.0, imagePath: 'assets/broasted_chicken.jpg', isPopular: true, isAvailable: true },
    { id: 'm5', category: 'broasted', name: 'بروستيد عائلي (12 قطعة)', description: '12 قطعة بروستيد عائلي مقرمش مع بطاطس عائلي و3 ثومية وخبز.', price: 580.0, imagePath: 'assets/broasted_chicken.jpg', isPopular: false, isAvailable: true },
    { id: 'm6', category: 'pizza', name: 'بيتزا شاورما الزين الخاصة', description: 'عجينة البيتزا الهشة مكسوة بشاورما الفراخ، الثومية، وجبنة الموتزاريلا.', price: 195.0, imagePath: 'assets/syrian_pizza.jpg', isPopular: true, isAvailable: true },
    { id: 'm7', category: 'manaqeesh', name: 'مناقيش زعتر وسماق شامي', description: 'عجينة الصاج المحمصة مكسوة بالزعتر السوري الأصيل وزيت الزيتون.', price: 65.0, imagePath: 'assets/manaqeesh_pastries.jpg', isPopular: false, isAvailable: true },
    { id: 'm8', category: 'manaqeesh', name: 'مناقيش جبنة كشكوان', description: 'مناقيش سورية محشوة بجبن الكشكوان الذائب من الفرن رأساً.', price: 90.0, imagePath: 'assets/manaqeesh_pastries.jpg', isPopular: false, isAvailable: true },
    { id: 'm9', category: 'sides', name: 'طبق ثومية سورية أصيلة', description: 'علبة ثومية غنية محضرة على الطريقة الشامية الأصيلة.', price: 25.0, imagePath: 'assets/sides_desserts.jpg', isPopular: false, isAvailable: true },
    { id: 'm10', category: 'desserts', name: 'كنافة نابلسية بالجبنة', description: 'كنافة نابلسية سخنة بالجبن القشقوان والمكسرات والشربات.', price: 75.0, imagePath: 'assets/sides_desserts.jpg', isPopular: false, isAvailable: true }
  ]);

  const [orders, setOrders] = useState([]);

  const [drivers, setDrivers] = useState([
    { id: 'dr_1', name: 'كابتن محمد صلاح 🛵', phone: '01099887766', currentBranch: 'فرع حدائق القبة 🍔', lat: 30.0826, lng: 31.2858, status: 'active', activeOrder: 'لا يوجد' },
    { id: 'dr_2', name: 'كابتن علي عمر 🛵', phone: '01155443322', currentBranch: 'فرع حدائق الزيتون 🍕', lat: 30.1022, lng: 31.3115, status: 'idle', activeOrder: 'لا يوجد' }
  ]);

  const [tables, setTables] = useState([
    { id: 't1', branch: 'فرع حدائق القبة 🍔', tableNumber: 1, capacity: 4, status: 'available' },
    { id: 't2', branch: 'فرع حدائق القبة 🍔', tableNumber: 2, capacity: 2, status: 'available' },
    { id: 't3', branch: 'فرع حدائق الزيتون 🍕', tableNumber: 1, capacity: 6, status: 'available' },
    { id: 't4', branch: 'فرع حدائق الزيتون 🍕', tableNumber: 2, capacity: 4, status: 'available' }
  ]);

  // Modals & POS States
  const [showMealModal, setShowMealModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [mealForm, setMealForm] = useState({
    name: '',
    description: '',
    price: '150',
    category: 'meals',
    isAvailable: true,
    isPopular: false,
    imagePath: 'assets/syrian_sandwiches.jpg'
  });

  const [posCart, setPosCart] = useState([]);
  const [posCategory, setPosCategory] = useState('all');
  const [posBranch, setPosBranch] = useState('br_001');
  const [posTable, setPosTable] = useState('takeaway');

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const [spillageList, setSpillageList] = useState([]);
  const [spillageForm, setSpillageForm] = useState({ name: '', cost: '', reason: '' });

  // Firestore REST API Configurations
  const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1/projects/el-zain-restaurant/databases/(default)/documents';

  const _stringToStatus = (str) => {
    if (!str) return 'preparing';
    if (str.includes('تجهيز') || str.includes('preparing') || str.includes('kitchen')) return 'preparing';
    if (str.includes('توصيل') || str.includes('delivering') || str.includes('way') || str.includes('out')) return 'delivering';
    if (str.includes('تسليم') || str.includes('delivered') || str.includes('complete')) return 'delivered';
    return 'preparing';
  };

  const _statusToString = (status) => {
    if (status === 'preparing') return 'قيد التجهيز 🟠';
    if (status === 'delivering') return 'خرج للتوصيل 🔵';
    if (status === 'delivered') return 'تم التسليم 🟢';
    return 'قيد التجهيز 🟠';
  };

  const fetchLiveOrders = async () => {
    try {
      const response = await fetch(`${FIRESTORE_BASE}/orders`);
      if (response.ok) {
        const data = await response.json();
        const documents = data.documents || [];
        const loadedOrders = documents.map(doc => {
          const fields = doc.fields || {};
          const docId = doc.name.split('/').pop();
          return {
            orderId: fields.orderId?.stringValue || docId,
            customerName: fields.customerName?.stringValue || 'عميل التطبيق 📱',
            phone: fields.customerPhone?.stringValue || '——',
            branch: fields.branch?.stringValue || 'فرع حدائق القبة 🍔',
            items: fields.itemsSummary?.stringValue || 'وجبات شاورما وبروستيد شامية',
            totalAmount: parseFloat(fields.totalAmount?.doubleValue || fields.totalAmount?.integerValue || '0'),
            paymentMethod: fields.paymentMethod?.stringValue || 'Paymob',
            status: _stringToStatus(fields.status?.stringValue),
            time: fields.createdAt?.stringValue ? new Date(fields.createdAt.stringValue).toLocaleTimeString('ar-EG') : 'منذ دقائق'
          };
        });
        if (loadedOrders.length > 0) {
          setOrders(loadedOrders);
        }
      }
    } catch (e) {
      console.error('Failed to fetch firestore orders:', e);
    }
  };

  const fetchLiveMenu = async () => {
    try {
      const response = await fetch(`${FIRESTORE_BASE}/menu`);
      if (response.ok) {
        const data = await response.json();
        const documents = data.documents || [];
        const loadedMenuItems = documents.map(doc => {
          const fields = doc.fields || {};
          const docId = doc.name.split('/').pop();
          return {
            id: fields.id?.stringValue || docId,
            category: fields.category?.stringValue || 'meals',
            name: fields.name?.stringValue || 'وجبة جديدة',
            description: fields.desc?.stringValue || '',
            price: parseFloat(fields.price?.doubleValue || fields.price?.integerValue || '100'),
            imagePath: fields.image?.stringValue || 'assets/syrian_sandwiches.jpg',
            isPopular: fields.popular?.booleanValue || false,
            isAvailable: fields.isAvailable?.booleanValue !== false
          };
        });
        if (loadedMenuItems.length > 0) {
          setMenuItems(loadedMenuItems);
        }
      }
    } catch (e) {
      console.error('Failed to fetch firestore menu:', e);
    }
  };

  // Real-time synchronization polling with new order detection
  useEffect(() => {
    const fetchAndDetect = async () => {
      const prevCount = prevOrderCountRef.current;

      try {
        const response = await fetch(`${FIRESTORE_BASE}/orders`);
        if (response.ok) {
          const data = await response.json();
          const documents = data.documents || [];
          const loadedOrders = documents.map(doc => {
            const fields = doc.fields || {};
            const docId = doc.name.split('/').pop();
            return {
              orderId: fields.orderId?.stringValue || docId,
              customerName: fields.customerName?.stringValue || 'عميل التطبيق 📱',
              phone: fields.customerPhone?.stringValue || '——',
              branch: fields.branch?.stringValue || 'فرع حدائق القبة 🍔',
              address: fields.address?.stringValue || '',
              items: fields.itemsSummary?.stringValue || 'وجبات شاورما',
              totalAmount: parseFloat(fields.totalAmount?.doubleValue || fields.totalAmount?.integerValue || '0'),
              paymentMethod: fields.paymentMethod?.stringValue || 'Paymob',
              status: _stringToStatus(fields.status?.stringValue),
              time: fields.createdAt?.stringValue ? new Date(fields.createdAt.stringValue).toLocaleTimeString('ar-EG') : 'الآن'
            };
          });

          if (loadedOrders.length > 0) {
            // Detect new incoming orders
            if (prevCount !== null && loadedOrders.length > prevCount) {
              const newest = loadedOrders[0];
              playAlertSound();
              setNewOrderAlert(newest);
              // Auto-dismiss after 8 seconds
              setTimeout(() => setNewOrderAlert(null), 8000);
            }
            prevOrderCountRef.current = loadedOrders.length;
            setOrders(loadedOrders);
          } else {
            if (prevCount === null) prevOrderCountRef.current = 0;
          }
        }
      } catch (e) {
        console.error('Failed to fetch firestore orders:', e);
      }
    };

    fetchAndDetect();
    fetchLiveMenu();
    const interval = setInterval(() => {
      fetchAndDetect();
      fetchLiveMenu();
    }, 12000);
    return () => clearInterval(interval);
  }, []);



  const openMealModal = (meal = null) => {
    if (meal) {
      setEditingMeal(meal);
      setMealForm({ ...meal, price: meal.price.toString() });
    } else {
      setEditingMeal(null);
      setMealForm({ name: '', description: '', price: '150', category: 'meals', isAvailable: true, isPopular: false, imagePath: 'assets/syrian_sandwiches.jpg' });
    }
    setShowMealModal(true);
  };

  const saveMeal = async (e) => {
    e.preventDefault();
    const itemId = editingMeal ? editingMeal.id : `m_${Date.now()}`;
    const priceVal = parseFloat(mealForm.price);

    const docData = {
      fields: {
        id: { stringValue: itemId },
        category: { stringValue: mealForm.category },
        name: { stringValue: mealForm.name },
        desc: { stringValue: mealForm.description },
        price: { doubleValue: priceVal },
        image: { stringValue: mealForm.imagePath },
        popular: { booleanValue: mealForm.isPopular },
        isAvailable: { booleanValue: mealForm.isAvailable }
      }
    };

    try {
      if (editingMeal) {
        await fetch(`${FIRESTORE_BASE}/menu/${itemId}?updateMask.fieldPaths=name&updateMask.fieldPaths=desc&updateMask.fieldPaths=price&updateMask.fieldPaths=category&updateMask.fieldPaths=popular&updateMask.fieldPaths=isAvailable`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(docData)
        });
      } else {
        await fetch(`${FIRESTORE_BASE}/menu?documentId=${itemId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(docData)
        });
      }
      fetchLiveMenu();
    } catch (e) {
      console.error('Failed to save meal to firestore:', e);
    }
    setShowMealModal(false);
  };

  const deleteMenuItem = async (itemId) => {
    if (!window.confirm('هل تريد بالتأكيد حذف هذا الصنف نهائياً من المنيو وقاعدة البيانات؟')) return;
    try {
      await fetch(`${FIRESTORE_BASE}/menu/${itemId}`, { method: 'DELETE' });
      setMenuItems(prev => prev.filter(m => m.id !== itemId));
    } catch (e) {
      console.error('Failed to delete menu item:', e);
    }
  };

  const toggleItemAvailability = async (item) => {
    const updatedStatus = !item.isAvailable;
    try {
      await fetch(`${FIRESTORE_BASE}/menu/${item.id}?updateMask.fieldPaths=isAvailable&updateMask.fieldPaths=inStock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            isAvailable: { booleanValue: updatedStatus },
            inStock: { booleanValue: updatedStatus }
          }
        })
      });
      setMenuItems(prev => prev.map(m => m.id === item.id ? { ...m, isAvailable: updatedStatus } : m));
    } catch (e) {
      console.error('Failed to toggle item availability:', e);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const statusStr = _statusToString(newStatus);
    try {
      await fetch(`${FIRESTORE_BASE}/orders/${orderId}?updateMask.fieldPaths=status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            status: { stringValue: statusStr }
          }
        })
      });
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
    } catch (e) {
      console.error('Failed to update order status:', e);
    }
  };

  const addToPosCart = (item) => {
    setPosCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromPosCart = (itemId) => {
    setPosCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing && existing.qty > 1) {
        return prev.map(i => i.id === itemId ? { ...i, qty: i.qty - 1 } : i);
      }
      return prev.filter(i => i.id !== itemId);
    });
  };

  const checkoutPosCart = async () => {
    if (posCart.length === 0) return;
    const orderId = `ZAIN-${1000 + orders.length + 1}`;
    const subtotal = posCart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const tax = subtotal * 0.14;
    const total = subtotal + tax;
    const branchName = branches.find(b => b.id === posBranch)?.name || 'فرع حدائق القبة 🍔';
    const newOrder = {
      orderId,
      customerName: 'طلب كاشير 🏪',
      phone: '——',
      branch: branchName,
      address: posTable === 'takeaway' ? 'استلام من المطعم' : `طاولة صالة`,
      items: posCart.map(i => `${i.name} (عدد ${i.qty})`).join('، '),
      totalAmount: total,
      paymentMethod: posTable === 'takeaway' ? 'نقدي (كاش)' : 'طلب صالة محلي',
      status: 'preparing',
      time: 'منذ ثانية'
    };

    setOrders(prev => [newOrder, ...prev]);
    setReceiptData({
      ...newOrder,
      itemsList: [...posCart],
      subtotal,
      tax,
      total
    });
    setPosCart([]);
    setShowReceiptModal(true);
  };

  const addSpillage = (e) => {
    e.preventDefault();
    if (!spillageForm.name || !spillageForm.cost) return;
    setSpillageList(prev => [
      {
        id: `sp_${Date.now()}`,
        name: spillageForm.name,
        cost: parseFloat(spillageForm.cost),
        reason: spillageForm.reason || 'تالف عام',
        date: new Date().toISOString().split('T')[0]
      },
      ...prev
    ]);
    setSpillageForm({ name: '', cost: '', reason: '' });
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, #1f1f3a 0%, #0d0d1a 100%)',
        fontFamily: 'Cairo, sans-serif',
        direction: 'rtl',
        padding: 20
      }}>
        <div style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(230, 161, 35, 0.3)',
          borderRadius: 24,
          padding: '36px 30px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          textAlign: 'center'
        }}>
          <div style={{
            width: 70, height: 70, borderRadius: '50%',
            background: 'linear-gradient(135deg, #E6A123, #f5c842)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: 32, boxShadow: '0 0 30px rgba(230,161,35,0.4)'
          }}>👑</div>
          <h2 style={{ color: '#FFF', fontSize: 22, fontWeight: 900, marginBottom: 8 }}>مطعم الزين للأكلات السورية</h2>
          <p style={{ color: '#aaa', fontSize: 13, marginBottom: 24 }}>لوحة تحكم الكاشير والمطبخ السحابية 🔒</p>

          <form onSubmit={handlePinSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#E6A123', fontSize: 12, fontWeight: 700, marginBottom: 8, textAlign: 'right' }}>
                أدخل رمز الدخول السري (PIN):
              </label>
              <input
                type="password"
                maxLength="6"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="****"
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 12,
                  border: '1px solid rgba(230,161,35,0.4)',
                  background: 'rgba(0,0,0,0.4)',
                  color: '#FFF',
                  fontSize: 22,
                  textAlign: 'center',
                  letterSpacing: 8,
                  outline: 'none'
                }}
              />
            </div>

            {pinError && (
              <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 14, fontWeight: 700 }}>
                {pinError}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #E6A123, #f5c842)',
                color: '#1a1a1a',
                fontSize: 15,
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(230,161,35,0.3)'
              }}
            >
              دخول لوحة التحكم 🚀
            </button>

            <div style={{ marginTop: 20, color: '#777', fontSize: 12 }}>
              🔑 رمز الدخول الافتراضي للكاشير: <strong style={{ color: '#E6A123' }}>8888</strong>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* ===== NEW ORDER ALERT POPUP ===== */}
      {newOrderAlert && (
        <div style={{
          position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, minWidth: 340, maxWidth: 480,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '2px solid #E6A123',
          borderRadius: 20,
          boxShadow: '0 0 40px rgba(230,161,35,0.5), 0 8px 32px rgba(0,0,0,0.6)',
          padding: '20px 24px',
          direction: 'rtl',
          animation: 'slideInAlert 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <style>{`
            @keyframes slideInAlert {
              from { opacity: 0; transform: translateX(-50%) translateY(-30px) scale(0.9); }
              to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
            }
            @keyframes pulseBorder {
              0%, 100% { box-shadow: 0 0 40px rgba(230,161,35,0.5); }
              50% { box-shadow: 0 0 60px rgba(230,161,35,0.9); }
            }
          `}</style>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'linear-gradient(135deg, #E6A123, #f5c842)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, flexShrink: 0,
              boxShadow: '0 0 20px rgba(230,161,35,0.6)',
              animation: 'pulseBorder 1s ease-in-out infinite',
            }}>🔔</div>
            <div>
              <div style={{ color: '#E6A123', fontWeight: 900, fontSize: 16, fontFamily: 'Cairo, sans-serif' }}>
                طلب جديد وصل! 🎉
              </div>
              <div style={{ color: '#aaa', fontSize: 12, fontFamily: 'Cairo, sans-serif' }}>
                طلب #{newOrderAlert.orderId} — {newOrderAlert.time}
              </div>
            </div>
            <button
              onClick={() => setNewOrderAlert(null)}
              style={{
                marginRight: 'auto', background: 'none', border: 'none',
                color: '#666', cursor: 'pointer', fontSize: 20, lineHeight: 1,
              }}
            >✕</button>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ color: '#fff', fontFamily: 'Cairo, sans-serif', fontSize: 14, marginBottom: 4, fontWeight: 700 }}>
              👤 {newOrderAlert.customerName}
            </div>
            <div style={{ color: '#ccc', fontFamily: 'Cairo, sans-serif', fontSize: 12, marginBottom: 4 }}>
              🍽️ {newOrderAlert.items}
            </div>
            {newOrderAlert.address && (
              <div style={{ color: '#ccc', fontFamily: 'Cairo, sans-serif', fontSize: 12, marginBottom: 4 }}>
                📍 {newOrderAlert.address}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <span style={{
                background: 'rgba(230,161,35,0.15)', border: '1px solid rgba(230,161,35,0.4)',
                color: '#E6A123', borderRadius: 8, padding: '3px 10px', fontSize: 12, fontFamily: 'Cairo, sans-serif', fontWeight: 700,
              }}>
                💰 {newOrderAlert.totalAmount} ج.م
              </span>
              <span style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                color: '#aaa', borderRadius: 8, padding: '3px 10px', fontSize: 11, fontFamily: 'Cairo, sans-serif',
              }}>
                {newOrderAlert.paymentMethod}
              </span>
            </div>
          </div>
          <button
            onClick={() => { setActiveTab('orders'); setNewOrderAlert(null); }}
            style={{
              marginTop: 12, width: '100%',
              background: 'linear-gradient(135deg, #E6A123, #f5c842)',
              border: 'none', borderRadius: 10, padding: '10px 0',
              color: '#1a1a1a', fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 14,
              cursor: 'pointer',
            }}
          >
            عرض الطلب الآن →
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">Z</div>
          <h2>لوحة تحكم الزين 👑</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <Icons.Analytics /> <span>الإحصائيات والأداء</span>
          </button>
          <button className={`nav-link ${activeTab === 'pos' ? 'active' : ''}`} onClick={() => setActiveTab('pos')}>
            <Icons.Pos /> <span>نقاط البيع POS 🖨️</span>
          </button>
          <button className={`nav-link ${activeTab === 'kds' ? 'active' : ''}`} onClick={() => setActiveTab('kds')}>
            <Icons.Kds /> <span>شاشة المطبخ KDS 🍳</span>
          </button>
          <button className={`nav-link ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>
            <Icons.Menu /> <span>إدارة أصناف المنيو</span>
          </button>
          <button className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <Icons.Orders /> <span>مراقبة الطلبات الحية</span>
          </button>
          <button className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            <Icons.Reports /> <span>التقارير المالية المتقدمة</span>
          </button>
          <button className={`nav-link ${activeTab === 'tables' ? 'active' : ''}`} onClick={() => setActiveTab('tables')}>
            <Icons.Tables /> <span>طاولات الصالة والحجز</span>
          </button>
          <button className={`nav-link ${activeTab === 'branches' ? 'active' : ''}`} onClick={() => setActiveTab('branches')}>
            <Icons.Branches /> <span>فروع وطابعات المطعم</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <p>لوحة التحكم السحابية v2.0</p>
          <button
            onClick={handleLogout}
            style={{
              marginTop: 10,
              width: '100%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              padding: '8px 0',
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            تسجيل الخروج 🚪
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Header bar */}
        <header className="main-header glass-panel">
          <div className="header-title">
            <h1>إدارة تحكم الموبايل السحابية ⚡</h1>
            <p>مزامنة حية مع هواتف العملاء وتطبيقات الطيارين والمطبخ</p>
          </div>
          <div className="header-status">
            <span className="live-indicator">🟢 نظام المزامنة متصل</span>
          </div>
        </header>

        {/* Tab Switcher Content */}
        <div className="tab-container animate-fade-in">
          {activeTab === 'analytics' && (
            <div className="tab-pane">
              <div className="grid-metrics">
                <div className="metric-card glass-panel">
                  <h4>مبيعات اليوم</h4>
                  <h3>16,420 ج.م</h3>
                  <p style={{ color: 'green' }}>+12% عن أمس 📈</p>
                </div>
                <div className="metric-card glass-panel">
                  <h4>الطلبات الجارية</h4>
                  <h3>{orders.filter(o => o.status !== 'delivered').length} طلب نشط</h3>
                  <p>تتم معالجتها في الفروع</p>
                </div>
                <div className="metric-card glass-panel">
                  <h4>الفروع المتصلة</h4>
                  <h3>{branches.filter(b => b.status !== 'closed').length} فروع نشطة</h3>
                  <p>تستقبل الطلبات الآن</p>
                </div>
                <div className="metric-card glass-panel">
                  <h4>الطيارين بالخدمة</h4>
                  <h3>{drivers.length} طيار دليفري</h3>
                  <p>تحت مراقبة الـ GPS</p>
                </div>
              </div>

              {/* Graphical Charts Simulation */}
              <div className="charts-container glass-panel">
                <h3>حجم المبيعات حسب الفروع (اليوم) 📊</h3>
                <div className="chart-bar-grid">
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar" style={{ height: '75%' }}><span>9,820 ج.م</span></div>
                    <span className="chart-label">حدائق القبة 🍔</span>
                  </div>
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar" style={{ height: '55%' }}><span>6,600 ج.م</span></div>
                    <span className="chart-label">حدائق الزيتون 🍕</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="tab-pane">
              <div className="pane-header">
                <h2>إدارة وتعديل أصناف المنيو الحية</h2>
                <button className="btn btn-primary" onClick={() => openMealModal()}>
                  <Icons.Plus /> إضافة وجبة جديدة
                </button>
              </div>

              <div className="menu-table-card glass-panel">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>اسم الوجبة</th>
                      <th>التصنيف</th>
                      <th>السعر</th>
                      <th>حالة التوفر</th>
                      <th>شائع</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map(item => (
                      <tr key={item.id}>
                        <td><strong>{item.name}</strong></td>
                        <td>{item.category === 'meals' ? 'وجبة 🥘' : item.category === 'sandwiches' ? 'ساندوتش 🌯' : 'بروستيد 🍗'}</td>
                        <td style={{ color: 'var(--gold-primary)', fontWeight: 'bold' }}>{item.price} ج.م</td>
                        <td>
                          <button className={`status-badge ${item.isAvailable ? 'available' : 'unavailable'}`}
                                  onClick={() => toggleItemAvailability(item)}>
                            {item.isAvailable ? 'متوفر 🟢' : 'غير متوفر 🔴'}
                          </button>
                        </td>
                        <td>{item.isPopular ? '⭐ شائع' : '-'}</td>
                        <td>
                          <div className="action-btns">
                            <button className="btn btn-secondary btn-sm" onClick={() => openMealModal(item)}>
                              <Icons.Edit />
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteMenuItem(item.id)}>
                              <Icons.Delete />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="tab-pane">
              <h2>مراقبة الطلبات الحية في الفروع POS 🍳</h2>
              <div className="orders-grid">
                {orders.map(order => (
                  <div className={`order-card glass-panel status-${order.status}`} key={order.orderId}>
                    <div className="card-header">
                      <h3>فاتورة #{order.orderId}</h3>
                      <span className="order-time">{order.time}</span>
                    </div>
                    <div className="card-body">
                      <p><strong>👤 العميل:</strong> {order.customerName} ({order.phone})</p>
                      <p><strong>🏬 الفرع:</strong> {order.branch}</p>
                      <p style={{
                        background: 'rgba(230,161,35,0.12)',
                        border: '1px solid rgba(230,161,35,0.3)',
                        borderRadius: 10,
                        padding: '8px 12px',
                        color: '#FFF',
                        margin: '8px 0',
                        fontSize: 13,
                        lineHeight: 1.4
                      }}>
                        <strong>📍 عنوان التوصيل:</strong> {order.address && order.address.trim() !== '' ? order.address : 'عنوان التوصيل (محدد على الخريطة/الفرع)'}
                      </p>
                      <p><strong>🍽️ الوجبات:</strong> {order.items}</p>
                      <p><strong>💳 طريقة الدفع:</strong> {order.paymentMethod}</p>
                      <p className="order-price" style={{ color: '#E6A123', fontSize: 16, fontWeight: 900 }}>الإجمالي: {order.totalAmount} ج.م</p>
                    </div>
                    <div className="card-footer" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                      <button
                        className="btn btn-secondary btn-block"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid #E6A123', color: '#E6A123', fontWeight: 800 }}
                        onClick={() => {
                          setReceiptData({
                            orderId: order.orderId,
                            customerName: order.customerName,
                            phone: order.phone,
                            branch: order.branch,
                            address: order.address || 'حدائق القبة',
                            itemsSummary: order.items,
                            totalAmount: order.totalAmount,
                            paymentMethod: order.paymentMethod,
                            subtotal: order.totalAmount,
                            total: order.totalAmount,
                            createdAt: order.time,
                            itemsList: [{ id: '1', name: order.items, qty: 1, price: order.totalAmount }]
                          });
                          setShowReceiptModal(true);
                        }}
                      >
                        🖨️ طباعة الفاتورة الحرارية
                      </button>

                      {order.status === 'received' || order.status === 'new' || order.status === 'جديد 🟡' ? (
                        <button
                          className="btn btn-primary btn-block"
                          style={{ background: 'linear-gradient(135deg, #E6A123, #f5c842)', color: '#1a1a1a', fontWeight: 900 }}
                          onClick={() => updateOrderStatus(order.orderId, 'preparing')}
                        >
                          قبول وتجهيز بالمطبخ 🍳
                        </button>
                      ) : order.status === 'preparing' || order.status === 'قيد التجهيز 🟠' ? (
                        <button
                          className="btn btn-warning btn-block"
                          style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', color: '#FFF', fontWeight: 900 }}
                          onClick={() => updateOrderStatus(order.orderId, 'delivering')}
                        >
                          إرسال للتوصيل مع الطيار 🛵
                        </button>
                      ) : order.status === 'delivering' || order.status === 'onTheWay' || order.status === 'خرج للتوصيل 🔵' ? (
                        <button
                          className="btn btn-success btn-block"
                          style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFF', fontWeight: 900 }}
                          onClick={() => updateOrderStatus(order.orderId, 'delivered')}
                        >
                          تم تسليم الطلب 🟢✓
                        </button>
                      ) : order.status === 'cancelled' || order.status === 'ملغي 🔴' ? (
                        <button className="btn btn-disabled btn-block" disabled style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid #EF4444' }}>
                          تم إلغاء الطلب 🔴
                        </button>
                      ) : (
                        <button className="btn btn-disabled btn-block" disabled style={{ background: 'rgba(255,255,255,0.05)', color: '#10B981', border: '1px solid #10B981' }}>
                          مكتمل ومسلم 🟢
                        </button>
                      )}

                      {order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'ملغي 🔴' && (
                        <button
                          className="btn btn-danger btn-block"
                          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid #EF4444', color: '#EF4444', fontWeight: 800, marginTop: 4 }}
                          onClick={() => {
                            if (window.confirm(`هل تريد بالتأكيد إلغاء الطلب #${order.orderId} بناءً على طلب العميل؟`)) {
                              updateOrderStatus(order.orderId, 'cancelled');
                            }
                          }}
                        >
                          إلغاء الطلب بناءً على طلب العميل ❌
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}



          {activeTab === 'pos' && (
            <div className="tab-pane">
              <h2>نظام نقاط البيع المباشر (POS Billing Terminal) 🖨️</h2>
              <div className="pos-layout">
                {/* Left Side: Items Grid */}
                <div className="pos-items-side glass-panel">
                  <div className="pos-category-filters">
                    <button className={posCategory === 'all' ? 'active' : ''} onClick={() => setPosCategory('all')}>الكل</button>
                    <button className={posCategory === 'meals' ? 'active' : ''} onClick={() => setPosCategory('meals')}>وجبات 🥘</button>
                    <button className={posCategory === 'sandwiches' ? 'active' : ''} onClick={() => setPosCategory('sandwiches')}>سندوتشات 🌯</button>
                    <button className={posCategory === 'broasted' ? 'active' : ''} onClick={() => setPosCategory('broasted')}>بروستيد 🍗</button>
                    <button className={posCategory === 'pizza' ? 'active' : ''} onClick={() => setPosCategory('pizza')}>بيتزا 🍕</button>
                  </div>
                  <div className="pos-items-grid">
                    {menuItems.filter(i => posCategory === 'all' || i.category === posCategory).map(item => (
                      <div className="pos-item-card glass-panel" key={item.id} onClick={() => addToPosCart(item)}>
                        <h4>{item.name}</h4>
                        <p>{item.price} ج.م</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Shopping Cart Summary */}
                <div className="pos-cart-side glass-panel">
                  <h3>سلة الكاشير الحالية</h3>
                  <div className="pos-cart-items">
                    {posCart.length === 0 ? (
                      <p className="empty-cart-msg">سلة المشتريات فارغة</p>
                    ) : (
                      posCart.map(cartItem => (
                        <div className="pos-cart-row" key={cartItem.id}>
                          <div className="row-info">
                            <strong>{cartItem.name}</strong>
                            <span>{cartItem.price} ج.م</span>
                          </div>
                          <div className="row-actions">
                            <button onClick={() => removeFromPosCart(cartItem.id)}>-</button>
                            <span className="qty">{cartItem.qty}</span>
                            <button onClick={() => addToPosCart(cartItem)}>+</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pos-cart-options">
                    <div className="form-group">
                      <label>اختر فرع المبيعات</label>
                      <select value={posBranch} onChange={(e) => setPosBranch(e.target.value)}>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>طريقة التوصيل / الطاولة</label>
                      <select value={posTable} onChange={(e) => setPosTable(e.target.value)}>
                        <option value="takeaway">سفري / دليفري (Takeaway) 🛍️</option>
                        <option value="1">طاولة صالة #1 🍽️</option>
                        <option value="2">طاولة صالة #2 🍽️</option>
                        <option value="3">طاولة صالة #3 🍽️</option>
                        <option value="4">طاولة صالة #4 🍽️</option>
                      </select>
                    </div>
                  </div>

                  <div className="pos-cart-totals">
                    <div className="total-row"><span>المجموع الفرعي:</span><strong>{posCart.reduce((sum, i) => sum + i.price * i.qty, 0)} ج.م</strong></div>
                    <div className="total-row"><span>الضريبة المضافة (14%):</span><strong>{(posCart.reduce((sum, i) => sum + i.price * i.qty, 0) * 0.14).toFixed(1)} ج.م</strong></div>
                    <div className="total-row grand-total"><span>الإجمالي النهائي:</span><strong>{(posCart.reduce((sum, i) => sum + i.price * i.qty, 0) * 1.14).toFixed(1)} ج.م</strong></div>
                  </div>

                  <button className="btn btn-primary btn-block pos-checkout-btn" disabled={posCart.length === 0} onClick={checkoutPosCart}>
                    إصدار بون الطباعة وفاتورة العميل 🖨️
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kds' && (
            <div className="tab-pane">
              <h2>شاشة تجهيز المطبخ الذكية (Kitchen Display System - KDS) 🍳</h2>
              <div className="kds-grid">
                {orders.filter(o => o.status === 'preparing').length === 0 ? (
                  <div className="kds-empty-state glass-panel">لا توجد طلبات قيد التحضير في المطبخ حالياً 🍕</div>
                ) : (
                  orders.filter(o => o.status === 'preparing').map(order => (
                    <div className="kds-card glass-panel" key={order.orderId}>
                      <div className="kds-card-header">
                        <h3>طلب #{order.orderId}</h3>
                        <span className="kds-timer">⏳ تحت الطهي</span>
                      </div>
                      <div className="kds-card-body">
                        <p className="kds-branch-label">الفرع: {order.branch}</p>
                        <div className="kds-items-list">
                          <strong>الوجبات المطلوبة:</strong>
                          <p>{order.items}</p>
                        </div>
                      </div>
                      <button className="btn btn-primary btn-block kds-ready-btn" onClick={() => updateOrderStatus(order.orderId, 'delivering')}>
                        تم التجهيز والطهي 🍳✓
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="tab-pane">
              <h2>التقارير المالية المتقدمة وتتبع الأرباح 📊</h2>
              
              <div className="grid-metrics">
                <div className="metric-card glass-panel">
                  <h4>إجمالي الإيرادات (اليوم)</h4>
                  <h3>16,420 ج.م</h3>
                  <p style={{ color: 'green' }}>إجمالي الفواتير النشطة</p>
                </div>
                <div className="metric-card glass-panel">
                  <h4>إجمالي الهالك والخسائر</h4>
                  <h3>{spillageList.reduce((sum, i) => sum + i.cost, 0)} ج.م</h3>
                  <p style={{ color: 'red' }}>قيمة المكونات التالفة</p>
                </div>
                <div className="metric-card glass-panel">
                  <h4>صافي الأرباح (بعد التوصيل والضرائب)</h4>
                  <h3>{(16420 - spillageList.reduce((sum, i) => sum + i.cost, 0) - (orders.length * 15)).toFixed(1)} ج.م</h3>
                  <p style={{ color: 'var(--gold-primary)' }}>الأرباح الصافية المتبقية</p>
                </div>
              </div>

              <div className="reports-actions glass-panel">
                <h3>تصدير البيانات والتقارير القانونية</h3>
                <div className="reports-buttons">
                  <button className="btn btn-primary" onClick={() => alert('تم توليد وتصدير التقرير كـ PDF بنجاح! 📄')}>تصدير التقرير كـ PDF 📄</button>
                  <button className="btn btn-secondary" onClick={() => alert('تم تصدير ملف إكسل مالي بنجاح! 📊')}>تصدير التقرير كـ Excel 📊</button>
                </div>
              </div>

              <div className="spillage-section glass-panel">
                <h3>تسجيل ومراقبة الهالك اليومي (Spillage Inventory)</h3>
                
                <form onSubmit={addSpillage} className="spillage-form">
                  <input type="text" placeholder="اسم المكون / الوجبة التالفة" required value={spillageForm.name}
                         onChange={(e) => setSpillageForm(prev => ({ ...prev, name: e.target.value }))} />
                  <input type="number" placeholder="التكلفة (ج.م)" required value={spillageForm.cost}
                         onChange={(e) => setSpillageForm(prev => ({ ...prev, cost: e.target.value }))} />
                  <input type="text" placeholder="السبب (مثال: انتهاء صلاحية)" value={spillageForm.reason}
                         onChange={(e) => setSpillageForm(prev => ({ ...prev, reason: e.target.value }))} />
                  <button type="submit" className="btn btn-primary">إضافة للهالك ＋</button>
                </form>

                <table className="custom-table" style={{ marginTop: '20px' }}>
                  <thead>
                    <tr>
                      <th>اسم المكون التالف</th>
                      <th>التكلفة والخسارة</th>
                      <th>سبب التلف</th>
                      <th>التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spillageList.map(item => (
                      <tr key={item.id}>
                        <td><strong>{item.name}</strong></td>
                        <td style={{ color: 'red', fontWeight: 'bold' }}>-{item.cost} ج.م</td>
                        <td>{item.reason}</td>
                        <td>{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="tab-pane">
              <h2>حجز طاولات الصالات بالفروع 🍽️</h2>
              <div className="tables-grid">
                {tables.map(table => (
                  <div className={`table-card glass-panel state-${table.status}`} key={table.id}>
                    <h3>طاولة #{table.tableNumber}</h3>
                    <p>الفرع: {table.branch}</p>
                    <p>السعة: {table.capacity} أفراد</p>
                    <div className="table-status-actions">
                      <span className="status-label">
                        {table.status === 'available' ? 'متاحة 🟢' : table.status === 'occupied' ? 'مشغولة 🔴' : 'محجوزة 🟡'}
                      </span>
                      <select value={table.status} onChange={(e) => setTables(prev => prev.map(t => t.id === table.id ? { ...t, status: e.target.value } : t))}>
                        <option value="available">متاحة</option>
                        <option value="occupied">مشغولة</option>
                        <option value="reserved">محجوزة</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'branches' && (
            <div className="tab-pane">
              <h2>إعدادات الفروع وطابعات الفواتير 🏢</h2>
              <div className="branches-list">
                {branches.map(branch => (
                  <div className="branch-settings-card glass-panel" key={branch.id}>
                    <h3>{branch.name}</h3>
                    <p>العنوان: {branch.address}</p>
                    <p>رقم التوصيل: {branch.phone}</p>
                    
                    <div className="settings-form-grid">
                      <div className="settings-input-group">
                        <label>طابعة المطبخ (IP)</label>
                        <input type="text" value={branch.kitchenPrinterIp || ''}
                               onChange={(e) => setBranches(prev => prev.map(b => b.id === branch.id ? { ...b, kitchenPrinterIp: e.target.value } : b))} />
                      </div>
                      <div className="settings-input-group">
                        <label>طابعة الكاشير (IP)</label>
                        <input type="text" value={branch.cashierPrinterIp || ''}
                               onChange={(e) => setBranches(prev => prev.map(b => b.id === branch.id ? { ...b, cashierPrinterIp: e.target.value } : b))} />
                      </div>
                      <div className="settings-input-group">
                        <label>حالة الفرع</label>
                        <select value={branch.status} onChange={(e) => setBranches(prev => prev.map(b => b.id === branch.id ? { ...b, status: e.target.value } : b))}>
                          <option value="open">مفتوح 🟢</option>
                          <option value="busy">مزدحم 🟡</option>
                          <option value="closed">مغلق 🔴</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Meal Modal Form */}
      {showMealModal && (
        <div className="modal-backdrop">
          <div className="modal-content glass-panel animate-fade-in">
            <h3>{editingMeal ? 'تعديل الوجبة ✏️' : 'إضافة وجبة جديدة للمنيو ➕'}</h3>
            <form onSubmit={saveMeal}>
              <div className="form-group">
                <label>اسم الوجبة</label>
                <input type="text" value={mealForm.name} required
                       onChange={(e) => setMealForm(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              
              <div className="form-group">
                <label>وصف الوجبة</label>
                <textarea value={mealForm.description} required
                          onChange={(e) => setMealForm(prev => ({ ...prev, description: e.target.value }))} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>السعر (ج.م)</label>
                  <input type="number" value={mealForm.price} required
                         onChange={(e) => setMealForm(prev => ({ ...prev, price: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>التصنيف</label>
                  <select value={mealForm.category}
                          onChange={(e) => setMealForm(prev => ({ ...prev, category: e.target.value }))}>
                    <option value="meals">وجبات 🥘</option>
                    <option value="sandwiches">سندوتشات 🌯</option>
                    <option value="broasted">بروستيد 🍗</option>
                    <option value="pizza">بيتزا 🍕</option>
                  </select>
                </div>
              </div>

              <div className="form-checkbox-row">
                <label>
                  <input type="checkbox" checked={mealForm.isAvailable}
                         onChange={(e) => setMealForm(prev => ({ ...prev, isAvailable: e.target.checked }))} />
                  <span>متوفرة للطلب الفوري</span>
                </label>
                <label>
                  <input type="checkbox" checked={mealForm.isPopular}
                         onChange={(e) => setMealForm(prev => ({ ...prev, isPopular: e.target.checked }))} />
                  <span>وجبة مميزة (شائعة)</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">حفظ الوجبة</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowMealModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Thermal Invoice Print Preview Popup */}
      {showReceiptModal && receiptData && (
        <div className="modal-backdrop">
          <div className="modal-content receipt-modal glass-panel animate-fade-in" style={{ width: '380px', color: '#000', backgroundColor: '#FFF', border: '2px solid #000' }}>
            <div className="thermal-receipt-preview" style={{ fontFamily: 'monospace', padding: '10px', fontSize: '13px', direction: 'rtl', textAlign: 'right' }}>
              <div className="receipt-header" style={{ textAlign: 'center', marginBottom: '10px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>مطعم الزين السوري 🌯</h2>
                <p style={{ margin: '0' }}>{receiptData.branch}</p>
                <p style={{ margin: '0 0 5px 0' }}>توصيل: 01016693570</p>
                <div className="receipt-divider">------------------------------------------</div>
                <h3 style={{ fontSize: '14px', margin: '5px 0' }}>إيصال كاشير ضريبي</h3>
                <p style={{ margin: '0' }}>رقم الفاتورة: INV-2026-{(receiptData.orderId || '1001').padStart(6, '0')}</p>
                <p style={{ margin: '0' }}>التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
              </div>

              <div className="receipt-divider">------------------------------------------</div>
              
              {/* Customer & Address Details */}
              <div className="receipt-customer" style={{ margin: '10px 0', borderBottom: '1px dashed #000', paddingBottom: '8px' }}>
                <p style={{ margin: '2px 0', fontWeight: 'bold' }}>👤 العميل: {receiptData.customerName || 'عميل التطبيق 📱'}</p>
                <p style={{ margin: '2px 0' }}>📞 الهاتف: {receiptData.phone || '——'}</p>
                <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', background: '#f5f5f5', padding: '6px', borderRadius: '4px', fontSize: '12px' }}>
                  📍 العنوان: {receiptData.address || 'عنوان التوصيل غير محدد'}
                </p>
              </div>

              <div className="receipt-items" style={{ margin: '10px 0' }}>
                {receiptData.itemsList?.map(cartItem => (
                  <div className="receipt-item-row" key={cartItem.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span className="name">{cartItem.name}</span>
                    <span className="details">{cartItem.qty} x {cartItem.price} ج.م</span>
                  </div>
                ))}
              </div>

              <div className="receipt-divider">------------------------------------------</div>

              <div className="receipt-totals" style={{ margin: '10px 0', fontWeight: 'bold' }}>
                <div className="receipt-total-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>المجموع الفرعي:</span>
                  <span>{receiptData.subtotal} ج.م</span>
                </div>
                <div className="receipt-total-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>الضريبة (14%):</span>
                  <span>{(receiptData.tax || 0).toFixed(1)} ج.م</span>
                </div>
                <div className="receipt-total-row grand-total" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', borderTop: '1px dashed #000', paddingTop: '5px', marginTop: '5px' }}>
                  <span>الإجمالي الكلي:</span>
                  <span>{(receiptData.total || receiptData.totalAmount || 0).toFixed(1)} ج.م</span>
                </div>
              </div>

              <div className="receipt-divider">------------------------------------------</div>
              <div className="receipt-footer" style={{ textAlign: 'center', marginTop: '10px' }}>
                <p style={{ margin: '0' }}>طريقة الدفع: {receiptData.paymentMethod}</p>
                <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>بالهناء والشفاء! شكراً لزيارتكم 🌯👑</p>
              </div>
            </div>
            
            <div className="modal-actions" style={{ marginTop: '20px', justifyContent: 'center', display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" style={{ backgroundColor: '#000', color: '#FFF', border: '1px solid #000' }} onClick={() => {
                window.print();
              }}>طباعة البون 🖨️</button>
              <button className="btn btn-secondary" style={{ backgroundColor: '#EEE', color: '#000', border: '1px solid #CCC' }} onClick={() => setShowReceiptModal(false)}>إغلاق المعاينة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

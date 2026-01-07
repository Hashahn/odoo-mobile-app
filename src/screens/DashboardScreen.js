/**
 * DashboardScreen.js
 * Main dashboard screen for the Odoo Mobile Application
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAuth } from '../components/AuthProvider';
import OdooAPI from '../utils/OdooAPI';

const DashboardScreen = () => {
  const { user, logout } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Example: Fetch recent sales orders
      // In a real app, this would fetch from multiple models based on user permissions
      const salesData = await OdooAPI.searchRead(
        'sale.order', 
        [['state', 'in', ['draft', 'sent', 'sale']]], 
        ['name', 'partner_id', 'date_order', 'amount_total', 'state'],
        0,
        10, // limit to 10 records
        'date_order DESC'
      );
      
      setRecords(salesData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
 }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const renderRecordItem = ({ item }) => (
    <TouchableOpacity style={styles.recordItem}>
      <View style={styles.recordHeader}>
        <Text style={styles.recordName}>{item.name}</Text>
        <Text style={styles.recordStatus}>{item.state}</Text>
      </View>
      <View style={styles.recordDetails}>
        <Text style={styles.recordPartner}>
          {item.partner_id ? item.partner_id[1] : 'N/A'}
        </Text>
        <Text style={styles.recordDate}>{item.date_order}</Text>
      </View>
      <Text style={styles.recordAmount}>${item.amount_total?.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.userInfo}>DB: {user?.db}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>New Orders</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>$12,450</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>18</Text>
          <Text style={styles.statLabel}>Tasks</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Sales Orders</Text>
          <TouchableOpacity onPress={() => Alert.alert('Info', 'View all orders')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={records}
          renderItem={renderRecordItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No records found</Text>
            </View>
          }
        />
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userInfo: {
    fontSize: 14,
    color: '#666',
 },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  content: {
    flex: 1,
    margin: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    color: '#1a73e8',
    fontSize: 14,
  },
  recordItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  recordName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  recordStatus: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: 'bold',
  },
  recordDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  recordPartner: {
    fontSize: 14,
    color: '#666',
  },
  recordDate: {
    fontSize: 14,
    color: '#999',
 },
  recordAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
    marginTop: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#e53935',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;